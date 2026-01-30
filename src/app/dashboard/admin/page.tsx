"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  UserRound, 
  BookOpen, 
  Calendar, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Plus,
  Search,
  MoreVertical,
  GraduationCap
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0, subjects: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [
      { count: studentsCount },
      { count: teachersCount },
      { count: classesCount },
      { count: subjectsCount }
    ] = await Promise.all([
      supabase.from("siswa").select("*", { count: "exact", head: true }),
      supabase.from("guru").select("*", { count: "exact", head: true }),
      supabase.from("kelas").select("*", { count: "exact", head: true }),
      supabase.from("mapel").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      students: studentsCount || 0,
      teachers: teachersCount || 0,
      classes: classesCount || 0,
      subjects: subjectsCount || 0
    });
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col fixed inset-y-0">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <GraduationCap className="h-8 w-8" />
            <span>SAS Admin</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Ringkasan" 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
          />
          <SidebarItem 
            icon={<UserRound className="h-5 w-5" />} 
            label="Data Guru" 
            active={activeTab === "teachers"} 
            onClick={() => setActiveTab("teachers")} 
          />
          <SidebarItem 
            icon={<Users className="h-5 w-5" />} 
            label="Data Siswa" 
            active={activeTab === "students"} 
            onClick={() => setActiveTab("students")} 
          />
          <SidebarItem 
            icon={<BookOpen className="h-5 w-5" />} 
            label="Mata Pelajaran" 
            active={activeTab === "subjects"} 
            onClick={() => setActiveTab("subjects")} 
          />
          <SidebarItem 
            icon={<Calendar className="h-5 w-5" />} 
            label="Jadwal Pelajaran" 
            active={activeTab === "schedules"} 
            onClick={() => setActiveTab("schedules")} 
          />
        </nav>
        <div className="p-4 border-t space-y-2">
          <SidebarItem icon={<Settings className="h-5 w-5" />} label="Pengaturan" active={false} onClick={() => {}} />
          <SidebarItem 
            icon={<LogOut className="h-5 w-5" />} 
            label="Keluar" 
            active={false} 
            onClick={handleLogout} 
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {activeTab === "overview" && "Ringkasan Sistem"}
              {activeTab === "teachers" && "Manajemen Guru"}
              {activeTab === "students" && "Manajemen Siswa"}
              {activeTab === "subjects" && "Mata Pelajaran"}
              {activeTab === "schedules" && "Jadwal Pelajaran"}
            </h1>
            <p className="text-zinc-500">Selamat datang kembali, Administrator</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
            <Plus className="h-4 w-4" />
            Tambah Data
          </button>
        </header>

        {activeTab === "overview" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard label="Total Siswa" value={stats.students} icon={<Users className="h-6 w-6 text-blue-600" />} color="bg-blue-50" />
            <StatsCard label="Total Guru" value={stats.teachers} icon={<UserRound className="h-6 w-6 text-green-600" />} color="bg-green-50" />
            <StatsCard label="Total Kelas" value={stats.classes} icon={<LayoutDashboard className="h-6 w-6 text-purple-600" />} color="bg-purple-50" />
            <StatsCard label="Mata Pelajaran" value={stats.subjects} icon={<BookOpen className="h-6 w-6 text-orange-600" />} color="bg-orange-50" />
          </div>
        )}

        {/* Content Placeholder for other tabs */}
        {activeTab !== "overview" && (
          <div className="rounded-3xl bg-white border border-zinc-100 p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400">
              <Search className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold">Belum Ada Data</h2>
            <p className="text-zinc-500 max-w-sm mx-auto">Silakan klik tombol "Tambah Data" untuk mulai mengelola {activeTab === "teachers" ? "guru" : activeTab === "students" ? "siswa" : "data"}.</p>
          </div>
        )}

        {/* Recent Activity Table (Mock) */}
        {activeTab === "overview" && (
          <div className="mt-8 rounded-3xl bg-white border border-zinc-100 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">Aktivitas Absensi Terbaru</h3>
              <button className="text-sm text-blue-600 font-medium">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Nama Siswa</th>
                    <th className="px-6 py-3">Kelas</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Waktu</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">Budi Santoso</td>
                    <td className="px-6 py-4 text-zinc-600 text-sm">XA-1</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Hadir</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">08:15 WIB</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-400 hover:text-zinc-600"><MoreVertical className="h-4 w-4" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">Siti Aminah</td>
                    <td className="px-6 py-4 text-zinc-600 text-sm">XA-1</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">Alpa</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">08:10 WIB</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-400 hover:text-zinc-600"><MoreVertical className="h-4 w-4" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
        active 
          ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-50" 
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
      } ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatsCard({ label, value, icon, color }: any) {
  return (
    <div className="rounded-3xl bg-white border border-zinc-100 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="text-3xl font-bold text-zinc-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
