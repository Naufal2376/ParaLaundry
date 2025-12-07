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

  const { data: initialUsers } = await supabase
    .from("profiles")
    .select("id, email, role, nama")
    .order("email", { ascending: true })

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <Users className="w-8 h-8 text-(--color-brand-primary)" />
        <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary)">
          Kelola User
        </h1>
      </header>

      <UserManager initialUsers={initialUsers || []} />
    </div>
  )
}
