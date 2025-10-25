import { Outlet, Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function ProtectedLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("[Auth] 已登出");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* 側邊欄 */}
      <aside className="w-64 bg-slate-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Protected Area</h2>

        <nav className="space-y-2">
          <Link
            to="/test1"
            className="block px-4 py-2 rounded hover:bg-slate-700 transition"
          >
            測試頁面 1
          </Link>
          <Link
            to="/test2"
            className="block px-4 py-2 rounded hover:bg-slate-700 transition"
          >
            測試頁面 2
          </Link>
          <Link
            to="/test3"
            className="block px-4 py-2 rounded hover:bg-slate-700 transition"
          >
            測試頁面 3
          </Link>
        </nav>

        <div className="mt-8 pt-8 border-t border-slate-700">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            登出
          </Button>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
