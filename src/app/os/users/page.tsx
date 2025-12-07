// src/app/os/users/page.tsx
import React from "react"
import { Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserManager } from "@/components/os/UserManager"

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // Hanya Owner yang boleh masuk
  if (profile?.role !== "Owner") redirect("/os")

  // Gunakan Admin client untuk bypass RLS dan ambil semua data
  const { createAdminClient } = await import("@/lib/supabase/admin")
  const adminClient = createAdminClient()

  // Ambil profiles dengan admin client agar bisa lihat semua user
  const { data: profiles } = await adminClient
    .from("profiles")
    .select("id, role, full_name")
    .order("full_name", { ascending: true })

  const {
    data: { users: authUsers },
  } = await adminClient.auth.admin.listUsers()

  // Gabungkan data profiles dengan auth users
  const initialUsers =
    profiles?.map((profile) => {
      const authUser = authUsers?.find((u) => u.id === profile.id)
      return {
        id: profile.id,
        email: authUser?.email || "N/A",
        role: profile.role,
        nama: profile.full_name || "N/A",
      }
    }) || []

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <Users className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">
          Kelola User
        </h1>
      </header>

      <UserManager initialUsers={initialUsers} />
    </div>
  )
}
