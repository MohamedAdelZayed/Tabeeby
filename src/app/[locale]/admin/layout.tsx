import AdminNavbar from "@/src/components/AdminNavbar";
import AdminSidebar from "@/src/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      
      <AdminNavbar />

      {/* 64px */}

      <div
        className="flex"
        style={{ paddingTop: "", paddingInline: "17px", minHeight: "100vh" }}
      >
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto p-1 sm:p-1 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
          {children}
        </main>
      </div>

    </div>
  );
}