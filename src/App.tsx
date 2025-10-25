import { Outlet, Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";

export default function App() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "首页" },
    { to: "/test1", label: "测试页面 1" },
    { to: "/test2", label: "测试页面 2" },
    { to: "/test3", label: "测试页面 3" },
    { to: "/login", label: "登入" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">
              React Router v7 Demo
            </h1>
            <div className="flex gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={location.pathname === link.to ? "default" : "outline"}
                    size="sm"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main>
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>React Router v7 Data Mode with Middleware Demo</p>
          <p className="text-sm mt-2">所有路由已应用日志 middleware，请查看控制台</p>
        </div>
      </footer>
    </div>
  );
}
