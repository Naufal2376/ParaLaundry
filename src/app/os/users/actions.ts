// src/app/os/users/actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "Owner") return { error: "Forbidden" }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId)

  if (error) return { error: error.message }

  revalidatePath("/os/users")
  return { success: true }
}

export async function deleteUser(userId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "Owner") return { error: "Forbidden" }

  // Delete from profiles first
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId)

  if (profileError) return { error: profileError.message }

  revalidatePath("/os/users")
  return { success: true }
}

export async function createUser(
  email: string,
  password: string,
  role: string,
  nama: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "Owner") return { error: "Forbidden" }

  // Gunakan Supabase Admin untuk create user
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin")
    const adminClient = createAdminClient()

    // Create user dengan admin client
    const { data: newUser, error: signUpError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto confirm email
        user_metadata: {
          full_name: nama,
        },
      })

    if (signUpError) return { error: signUpError.message }

    if (newUser.user) {
      // Upsert dengan admin client (service role) agar melewati RLS
      const { error: profileError } = await adminClient.from("profiles").upsert(
        [
          {
            id: newUser.user.id,
            full_name: nama,
            role: role,
          },
        ],
        { onConflict: "id" }
      )

      if (profileError) {
        // Jika upsert profile gagal, hapus user auth agar tidak ada orphan
        await adminClient.auth.admin.deleteUser(newUser.user.id)
        return { error: profileError.message }
      }
    }

    revalidatePath("/os/users")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Gagal membuat user" }
  }
}
