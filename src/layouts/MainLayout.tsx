/**
 * 主佈局元件
 * 包含側邊欄、使用者資訊、主內容區
 */

import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import DynamicSidebar from "@/components/DynamicSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings } from "lucide-react";

export default function MainLayout() {
  const { user, menuItems, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    console.log("[MainLayout] 已登出，導向登入頁");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* 側邊欄 */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-lg">
        {/* Logo / 標題區 */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700 px-4">
          <Settings className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold">權限管理系統</h1>
        </div>

        {/* 選單區（可滾動） */}
        <div className="flex-1 overflow-hidden">
          <DynamicSidebar menuItems={menuItems} />
        </div>

        {/* 使用者資訊區 */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-slate-600 text-white">
                {user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <Separator className="my-2 bg-slate-700" />

          {/* 角色標籤 */}
          {user?.roles && user.roles.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-slate-400 mb-1">角色</p>
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-0.5 bg-slate-700 rounded text-[10px] font-mono"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleLogout}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
