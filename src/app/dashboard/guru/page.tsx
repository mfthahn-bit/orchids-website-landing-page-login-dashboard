"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ClipboardCheck, 
  Calendar, 
  History, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  ChevronRight,
  User,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function GuruDashboard() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    // In a real app, we'd filter by the logged-in teacher's profile_id
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: teacher } = await supabase
      .from("guru")
      .select("id")
      .eq("profile_id", user?.id)
      .single();

    const { data: scheduleData } = await supabase
      .from("jadwal")
      .select("*, kelas(nama_kelas), mapel(nama_mapel)")
      .eq("id_guru_fk", teacher?.id);

    setSchedules(scheduleData || []);
    setIsLoading(false);
  };

  const startAttendance = async (schedule: any) => {
    setSelectedSchedule(schedule);
    const { data: studentData } = await supabase
      .from("siswa")
      .select("*")
      .eq("id_kelas_fk", schedule.id_kelas_fk);
    
    setStudents(studentData || []);
    // Default all to 'Hadir'
    const initialAttendance: Record<number, string> = {};
    studentData?.forEach(s => {
      initialAttendance[s.id] = 'Hadir';
    });
    setAttendance(initialAttendance);
  };

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    setIsLoading(true);
    try {
      // 1. Create session
      const { data: session, error: sessionError } = await supabase
        .from("sesi_absensi")
        .insert({
          id_jadwal_fk: selectedSchedule.id,
          tanggal_sesi: new Date().toISOString().split('T')[0],
          waktu_mulai: new Date().toLocaleTimeString('id-ID', { hour12: false })
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // 2. Insert attendance records
      const records = students.map(s => ({
        id_sesi_fk: session.id,
        id_siswa_fk: s.id,
        status_kehadiran: attendance[s.id],
        waktu_catat: new Date().toISOString()
      }));

      const { error: recordsError } = await supabase
        .from("catatan_absensi")
        .insert(records);

      if (recordsError) throw recordsError;

      alert("Absensi berhasil disimpan!");
      setSelectedSchedule(null);
      setActiveTab("history");
    } catch (err: any) {
      alert("Gagal menyimpan absensi: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col fixed inset-y-0">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl text-blue-600 mb-6">
            <ClipboardCheck className="h-8 w-8" />
            <span>SAS Guru</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
              <User className="h-8 w-8" />
            </div>
            <p className="font-semibold text-zinc-900">Guru Pengajar</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">NIP: 19850101XXXX</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem 
            icon={<Calendar className="h-5 w-5" />} 
            label="Input Absensi" 
            active={activeTab === "attendance"} 
            onClick={() => setActiveTab("attendance")} 
          />
          <SidebarItem 
            icon={<History className="h-5 w-5" />} 
            label="Riwayat Absensi" 
            active={activeTab === "history"} 
            onClick={() => setActiveTab("history")} 
          />
        </nav>
        <div className="p-4 border-t">
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
        {!selectedSchedule ? (
          <>
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900">Jadwal Mengajar Hari Ini</h1>
              <p className="text-zinc-500">Pilih kelas untuk mulai mencatat kehadiran</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {schedules.length > 0 ? schedules.map((s) => (
                <div key={s.id} className="group rounded-3xl bg-white border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                      <Clock className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{s.hari}</span>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 mb-1">{s.mapel?.nama_mapel}</h3>
                  <p className="text-zinc-500 font-medium mb-4 flex items-center gap-1">
                    Kelas {s.kelas?.nama_kelas}
                  </p>
                  <button 
                    onClick={() => startAttendance(s)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-all"
                  >
                    Mulai Absensi
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center space-y-4 rounded-3xl border-2 border-dashed border-zinc-200">
                  <div className="mx-auto w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Tidak Ada Jadwal</h3>
                    <p className="text-zinc-500">Hubungi admin jika jadwal Anda belum muncul.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => setSelectedSchedule(null)}
              className="mb-6 text-sm font-medium text-zinc-500 hover:text-blue-600 flex items-center gap-1"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Kembali ke Jadwal
            </button>

            <div className="rounded-3xl bg-white border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-100">
              <div className="p-8 bg-zinc-900 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedSchedule.mapel?.nama_mapel}</h2>
                    <p className="text-zinc-400">Kelas {selectedSchedule.kelas?.nama_kelas} • {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-400">{students.length}</p>
                    <p className="text-xs text-zinc-400 uppercase tracking-widest">Total Siswa</p>
                  </div>
                </div>
              </div>

              <div className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4">Nama Siswa</th>
                      <th className="px-8 py-4 text-center">Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-zinc-900">{student.nama_lengkap}</p>
                          <p className="text-xs text-zinc-400">NISN: {student.nisn}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-2">
                            <StatusButton 
                              label="H" 
                              active={attendance[student.id] === 'Hadir'} 
                              onClick={() => handleStatusChange(student.id, 'Hadir')}
                              color="active:bg-green-600 active:text-white"
                              activeColor="bg-green-600 text-white shadow-md shadow-green-100"
                              title="Hadir"
                            />
                            <StatusButton 
                              label="I" 
                              active={attendance[student.id] === 'Izin'} 
                              onClick={() => handleStatusChange(student.id, 'Izin')}
                              color="active:bg-blue-600 active:text-white"
                              activeColor="bg-blue-600 text-white shadow-md shadow-blue-100"
                              title="Izin"
                            />
                            <StatusButton 
                              label="S" 
                              active={attendance[student.id] === 'Sakit'} 
                              onClick={() => handleStatusChange(student.id, 'Sakit')}
                              color="active:bg-orange-600 active:text-white"
                              activeColor="bg-orange-600 text-white shadow-md shadow-orange-100"
                              title="Sakit"
                            />
                            <StatusButton 
                              label="A" 
                              active={attendance[student.id] === 'Alpa'} 
                              onClick={() => handleStatusChange(student.id, 'Alpa')}
                              color="active:bg-red-600 active:text-white"
                              activeColor="bg-red-600 text-white shadow-md shadow-red-100"
                              title="Alpa"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-8 bg-zinc-50 border-t flex items-center justify-between">
                <div className="flex gap-4 text-xs font-medium text-zinc-500">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-600" /> Hadir</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600" /> Izin</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-600" /> Sakit</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-600" /> Alpa</div>
                </div>
                <button 
                  onClick={submitAttendance}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-base font-bold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
                >
                  {isLoading ? "Menyimpan..." : "Simpan Absensi"}
                  {!isLoading && <CheckCircle2 className="h-5 w-5" />}
                </button>
              </div>
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
          ? "bg-blue-50 text-blue-600 shadow-sm" 
          : "text-zinc-600 hover:bg-zinc-50"
      } ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusButton({ label, active, onClick, activeColor, color, title }: any) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border border-zinc-200 ${
        active ? activeColor : `bg-white text-zinc-400 hover:border-zinc-400 ${color}`
      }`}
    >
      {label}
    </button>
  );
}
