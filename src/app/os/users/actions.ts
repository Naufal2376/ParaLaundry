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

  // Note: Creating users through Supabase auth requires admin privileges
  // This is a simplified version - in production, you'd use Supabase Admin API
  const { data: newUser, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) return { error: signUpError.message }

  if (newUser.user) {
    // Update profile with role and name
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role, nama })
      .eq("id", newUser.user.id)

    if (profileError) return { error: profileError.message }
  }

  revalidatePath("/os/users")
  return { success: true }
}
