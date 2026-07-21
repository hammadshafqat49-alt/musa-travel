"use client";
import { withPermission } from "@/lib/with-permission";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Shield, Users, Save, Check } from "lucide-react";

const ALL_PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "agents", label: "Agents" },
  { key: "packages", label: "Umrah Packages" },
  { key: "umrah_groups", label: "Umrah Groups" },
  { key: "hotels", label: "Hotels" },
  { key: "bookings", label: "Bookings" },
  { key: "tickets", label: "Tickets" },
  { key: "ledger", label: "Ledger" },
  { key: "downloads", label: "Downloads" },
  { key: "settings", label: "Settings" },
];

interface Role {
  id: number;
  name: string;
  permissions: string;
  created_at: string;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

function AdminRolesPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "users">("users");

  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [rolePerms, setRolePerms] = useState<string[]>([]);

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({
    username: "", email: "", password: "", name: "", role: "admin",
  });

  const fetchRoles = async () => {
    const res = await fetch("/api/admin/roles");
    const data = await res.json();
    setRoles(data.roles || []);
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/admins");
    const data = await res.json();
    setUsers(data.admins || []);
  };

  useEffect(() => {
    Promise.all([fetchRoles(), fetchUsers()]).then(() => setLoading(false));
  }, []);

  const resetRoleForm = () => {
    setRoleName("");
    setRolePerms([]);
    setEditingRole(null);
    setShowRoleForm(false);
  };

  const resetUserForm = () => {
    setUserForm({ username: "", email: "", password: "", name: "", role: "admin" });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const togglePerm = (key: string) => {
    setRolePerms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: roleName, permissions: rolePerms };
    if (editingRole) {
      await fetch("/api/admin/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingRole.id }),
      });
    } else {
      await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetRoleForm();
    fetchRoles();
  };

  const handleEditRole = (r: Role) => {
    setRoleName(r.name);
    try {
      setRolePerms(JSON.parse(r.permissions || "[]"));
    } catch {
      setRolePerms([]);
    }
    setEditingRole(r);
    setShowRoleForm(true);
  };

  const handleDeleteRole = async (id: number) => {
    if (!confirm("Delete this role? Any users with this role will lose access.")) return;
    await fetch(`/api/admin/roles?id=${id}`, { method: "DELETE" });
    fetchRoles();
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...userForm };
    if (editingUser) {
      await fetch("/api/admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingUser.id }),
      });
    } else {
      await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetUserForm();
    fetchUsers();
  };

  const handleEditUser = (u: AdminUser) => {
    setUserForm({
      username: u.username,
      email: u.email,
      password: "",
      name: u.name || "",
      role: u.role || "admin",
    });
    setEditingUser(u);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/admin/admins?id=${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const getRolePermsArray = (r: Role) => {
    try {
      return JSON.parse(r.permissions || "[]") as string[];
    } catch {
      return [];
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0c1d4a]">Users & Roles</h1>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "users"
              ? "border-[#dc2626] text-[#dc2626]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users size={16} /> Users
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "roles"
              ? "border-[#dc2626] text-[#dc2626]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Shield size={16} /> Roles
        </button>
      </div>

      {/* ===== USERS TAB ===== */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0c1d4a]">Admin Users</h2>
            <button
              onClick={() => { resetUserForm(); setShowUserForm(true); }}
              className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <Plus size={16} /> Add User
            </button>
          </div>

          {showUserForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">{editingUser ? "Edit User" : "Add User"}</h3>
                <button onClick={resetUserForm} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Username *</label>
                  <input
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">
                    Password {editingUser ? "(leave blank to keep)" : "*"}
                  </label>
                  <input
                    required={!editingUser}
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Full Name</label>
                  <input
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0c1d4a] mb-1">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button type="button" onClick={resetUserForm} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-[#dc2626] text-white rounded-md text-sm hover:bg-[#b91c1c]">
                    <Save size={14} /> {editingUser ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">ID</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">Username</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">Email</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">Name</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">Role</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u.id}</td>
                      <td className="px-4 py-3 font-medium">{u.username}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.name || "-"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium capitalize">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditUser(u)} className="text-blue-500 hover:text-blue-700">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== ROLES TAB ===== */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0c1d4a]">System Roles</h2>
            <button
              onClick={() => { resetRoleForm(); setShowRoleForm(true); }}
              className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <Plus size={16} /> Add Role
            </button>
          </div>

          {showRoleForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">{editingRole ? "Edit Role" : "Add Role"}</h3>
                <button onClick={resetRoleForm} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleRoleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                  <input
                    required
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. Manager"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {ALL_PERMISSIONS.map((p) => (
                      <label
                        key={p.key}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-sm transition-colors ${
                          rolePerms.includes(p.key)
                            ? "bg-[#dc2626]/10 border-[#dc2626] text-[#dc2626]"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={rolePerms.includes(p.key)}
                          onChange={() => togglePerm(p.key)}
                          className="hidden"
                        />
                        {rolePerms.includes(p.key) ? <Check size={14} /> : <div className="w-3.5 h-3.5" />}
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={resetRoleForm} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-[#dc2626] text-white rounded-md text-sm hover:bg-[#b91c1c]">
                    <Save size={14} /> {editingRole ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">ID</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">Role Name</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">Permissions</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {roles.map((r) => {
                    const perms = getRolePermsArray(r);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{r.id}</td>
                        <td className="px-4 py-3 font-medium capitalize">{r.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {perms.length === 0 && (
                              <span className="text-xs text-gray-400">No permissions</span>
                            )}
                            {perms.map((p) => {
                              const label = ALL_PERMISSIONS.find((ap) => ap.key === p)?.label || p;
                              return (
                                <span key={p} className="px-2 py-0.5 bg-[#1e3a8a]/10 text-[#1e3a8a] rounded text-[10px] font-medium">
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditRole(r)} className="text-blue-500 hover:text-blue-700">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDeleteRole(r.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {roles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No roles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default withPermission(AdminRolesPage, 'settings');
