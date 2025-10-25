import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_PERMISSIONS } from "@/mocks/authMockData";
import { collectAllPaths } from "@/router";

export default function Login() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, user, permissionTree } = useAuth();

  const handleLogin = (userType: keyof typeof MOCK_PERMISSIONS) => {
    login(userType);

    // 登入後導航到第一個有權限的頁面
    setTimeout(() => {
      const mockTree = MOCK_PERMISSIONS[userType];
      const allPaths = collectAllPaths(mockTree);
      const firstRoute = allPaths.find((r) => r !== "/" && r !== "/login");
      navigate(firstRoute || "/");
    }, 300);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-[500px] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">使用者認證系統</CardTitle>
          <CardDescription>
            選擇不同身份登入，體驗動態路由權限控制
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 當前狀態顯示 */}
          <div className="text-center p-4 rounded-lg bg-slate-100">
            <p className="text-sm text-slate-600 mb-2">當前狀態</p>
            {isAuthenticated ? (
              <div>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  ✓ 已登入
                </p>
                <p className="text-sm text-slate-700">
                  身份：<span className="font-semibold">{user?.name}</span>
                </p>
                <p className="text-sm text-slate-700">
                  Email：<span className="font-semibold">{user?.email}</span>
                </p>
                <div className="mt-2 pt-2 border-t border-slate-300">
                  <p className="text-xs text-slate-600 mb-1">可訪問的路由：</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {collectAllPaths(permissionTree).map((route) => (
                      <span
                        key={route}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-2xl font-bold text-red-600">✗ 未登入</p>
            )}
          </div>

          {/* 登入按鈕區 */}
          {!isAuthenticated ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Button
                  onClick={() => handleLogin("admin")}
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <div className="text-left w-full">
                    <div className="font-bold">👑 Admin 登入</div>
                    <div className="text-xs opacity-90">
                      完整權限：可訪問所有頁面 (/, /test1, /test2, /test3)
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleLogin("user")}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  variant="default"
                >
                  <div className="text-left w-full">
                    <div className="font-bold">👤 User 登入</div>
                    <div className="text-xs opacity-90">
                      部分權限：可訪問 / 和 /test1
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleLogin("guest")}
                  className="w-full h-14 text-lg bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
                  variant="default"
                >
                  <div className="text-left w-full">
                    <div className="font-bold">🌐 Guest 登入</div>
                    <div className="text-xs opacity-90">
                      最小權限：只能訪問首頁 (/)
                    </div>
                  </div>
                </Button>
              </div>

              {/* 說明文字 */}
              <div className="text-sm text-slate-600 space-y-1 pt-4 border-t">
                <p className="font-semibold mb-2">動態路由特性：</p>
                <p>• 路由表根據使用者權限動態生成</p>
                <p>• 沒有權限的路由不存在於 router 中</p>
                <p>• 嘗試訪問無權限路由會顯示 404</p>
                <p>• 登入/登出時自動重建路由表（useMemo 優化）</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={logout}
                variant="destructive"
                className="w-full h-12 text-lg"
              >
                登出
              </Button>

              <div className="pt-4 border-t space-y-2">
                <p className="text-sm text-slate-600 font-semibold mb-2">
                  快速導航：
                </p>
                {collectAllPaths(permissionTree)
                  .filter((route) => route !== "/login")
                  .map((route) => (
                    <Button
                      key={route}
                      onClick={() => navigate(route)}
                      variant="outline"
                      className="w-full"
                    >
                      前往 {route === "/" ? "首頁" : route}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
