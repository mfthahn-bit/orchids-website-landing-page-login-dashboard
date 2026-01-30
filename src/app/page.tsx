import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, Bell, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <ClipboardCheck className="h-6 w-6" />
            <span>SAS School</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Fitur</Link>
            <Link href="#about" className="hover:text-blue-600 transition-colors">Tentang</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Masuk Sistem
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Versi 1.0 Baru Saja Rilis
              </div>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
                Digitalisasi Absensi Siswa <span className="text-blue-600">Lebih Cepat & Akurat</span>
              </h1>
              <p className="max-w-2xl text-lg text-zinc-600 md:text-xl">
                Sistem pengelolaan kehadiran terpadu untuk sekolah modern. Pantau kehadiran siswa secara real-time, buat laporan otomatis, dan kirim notifikasi instan kepada orang tua.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/login" 
                  className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-medium text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                >
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  href="#features" 
                  className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-base font-medium text-zinc-600 hover:bg-zinc-50 transition-all"
                >
                  Pelajari Fitur
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-zinc-50 py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Solusi Lengkap Manajemen Sekolah</h2>
              <p className="mx-auto max-w-2xl text-zinc-600">
                Didesain khusus untuk memenuhi kebutuhan administrasi sekolah dengan antarmuka yang intuitif.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-zinc-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-xl">Pencatatan Real-time</h3>
                <p className="text-zinc-600">Guru dapat mencatat kehadiran langsung dari kelas menggunakan perangkat apapun dengan hitungan detik.</p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-zinc-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-xl">Notifikasi Otomatis</h3>
                <p className="text-zinc-600">Kirim pemberitahuan instan kepada orang tua jika siswa tidak hadir tanpa keterangan (Alpa).</p>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-zinc-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-xl">Akses Berbasis Peran</h3>
                <p className="text-zinc-600">Keamanan data terjamin dengan kontrol akses ketat untuk Administrator, Guru, dan Orang Tua.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="rounded-3xl bg-blue-600 p-8 md:p-16 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-blue-500 opacity-50 blur-3xl" />
              <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
                <div>
                  <div className="text-4xl font-bold">100%</div>
                  <div className="mt-2 text-blue-100">Digital</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">0%</div>
                  <div className="mt-2 text-blue-100">Kertas</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">50+</div>
                  <div className="mt-2 text-blue-100">Sekolah Percaya</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">Real-time</div>
                  <div className="mt-2 text-blue-100">Pelaporan</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-zinc-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2 font-bold text-xl text-zinc-900">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
              <span>SAS School</span>
            </div>
            <p className="text-sm text-zinc-500">
              © 2026 Sistem Absensi Siswa. Seluruh hak cipta dilindungi.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-zinc-500 hover:text-blue-600">Kebijakan Privasi</Link>
              <Link href="#" className="text-sm text-zinc-500 hover:text-blue-600">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
