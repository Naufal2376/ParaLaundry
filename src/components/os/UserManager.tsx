"use client"
import React, { useState, useMemo, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, UserPlus, Pencil, Trash2, Save, X } from "lucide-react"
import { updateUserRole, deleteUser } from "@/app/os/users/actions"

type UserRow = {
  id: string
  email: string
  role: string
  nama: string | null
}

interface UserManagerProps {
  initialUsers: UserRow[]
}

export const UserManager: React.FC<UserManagerProps> = ({ initialUsers }) => {
  const [rows, setRows] = useState<UserRow[]>(initialUsers)
  const [editing, setEditing] = useState<UserRow | null>(null)
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "Pegawai",
    nama: "",
  })

  const refreshTable = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("profiles")
      .select("id, email, role, nama")
      .order("email", { ascending: true })
    if (data) setRows(data as any)
  }

  const handleSaveEdit = async (user: UserRow) => {
    if (!editing) return

    startTransition(async () => {
      const result = await updateUserRole(user.id, editing.role)
      if (result.error) {
        alert("Gagal update: " + result.error)
      } else {
        setEditing(null)
        await refreshTable()
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Anda yakin ingin menghapus user ini?")) {
      startTransition(async () => {
        const result = await deleteUser(id)
        if (result.error) {
          alert("Gagal menghapus: " + result.error)
        } else {
          setRows(rows.filter((x) => x.id !== id))
        }
      })
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    // For now, we'll just add to the profiles table
    // In production, you'd want proper user creation through Supabase Admin API
    startTransition(async () => {
      const supabase = createClient()

      // This is a simplified approach - typically you'd need admin privileges
      alert(
        "Fitur tambah user memerlukan Supabase Admin API. Silakan tambahkan user melalui Supabase Dashboard."
      )
      setShowAddModal(false)
      setNewUser({ email: "", password: "", role: "Pegawai", nama: "" })
    })
  }

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.email.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        (r.nama && r.nama.toLowerCase().includes(q))
    )
  }, [rows, query])

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari user..."
              className="w-full pl-10 pr-4 py-2 border border-(--color-light-primary-active) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary)"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="shine-button flex items-center bg-(--color-brand-primary) text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:scale-105"
          >
            <UserPlus className="mr-2" size={18} />
            Tambah User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table
            className={`w-full text-left ${isPending ? "opacity-50" : ""}`}
          >
            <thead>
              <tr className="border-b border-(--color-light-primary-active)">
                <th className="p-3">Email</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.nama || "-"}</td>
                  <td className="p-3">
                    {editing?.id === r.id ? (
                      <select
                        className="p-2 border rounded"
                        value={editing.role}
                        onChange={(e) =>
                          setEditing({ ...editing, role: e.target.value })
                        }
                      >
                        <option value="Pegawai">Pegawai</option>
                        <option value="Owner">Owner</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          r.role === "Owner"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {r.role}
                      </span>
                    )}
                  </td>
                  <td className="p-3 space-x-2 text-center">
                    {editing?.id === r.id ? (
                      <>
                        <button
                          type="button"
                          className="px-3 py-1 bg-(--color-brand-primary) text-white rounded hover:opacity-90"
                          disabled={isPending}
                          onClick={() => handleSaveEdit(r)}
                        >
                          <Save size={16} className="inline" />
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:opacity-90"
                          disabled={isPending}
                          onClick={() => setEditing(null)}
                        >
                          <X size={16} className="inline" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
                          disabled={isPending}
                          onClick={() => setEditing(r)}
                        >
                          <Pencil size={16} className="inline" />
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
                          disabled={isPending}
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 size={16} className="inline" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td className="p-3 text-center" colSpan={4}>
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah User */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Tambah User Baru</h2>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nama</label>
                  <input
                    type="text"
                    value={newUser.nama}
                    onChange={(e) =>
                      setNewUser({ ...newUser, nama: e.target.value })
                    }
                    required
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                    minLength={6}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Pegawai">Pegawai</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-(--color-brand-primary) text-white py-2 rounded-lg hover:opacity-90"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:opacity-90"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
