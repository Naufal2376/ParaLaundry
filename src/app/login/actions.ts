// src/app/login/actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  // 1. Panggil klien server (dengan await)
  const supabase = await createClient();

  // 2. Ambil data dari form
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 3. Panggil fungsi login bawaan Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // 4. Jika gagal, kembali ke halaman login dengan pesan error
    return redirect(
      "/login?message=Login gagal, periksa kembali email dan password Anda."
    );
  }

  // 5. Jika berhasil, segarkan cache dan arahkan ke dashboard
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
