"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect("/login?message=Login gagal, periksa kembali email dan password Anda.");
  }

  revalidatePath("/", "layout");
  redirect("/os");
}

export async function logout() {
  const supabase = await createClient();

  // Hancurkan sesi/cookie
  await supabase.auth.signOut();

  // Segarkan cache dan arahkan kembali ke halaman login
  revalidatePath("/", "layout");
  redirect("/login");
}
