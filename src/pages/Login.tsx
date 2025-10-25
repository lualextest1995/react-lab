import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleToggleAuth = () => {
    if (isLoggedIn) {
      // 登出
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      console.log("[Auth] 已登出");
    } else {
      // 登入（模擬）
      localStorage.setItem("token", "mock-token-12345");
      setIsLoggedIn(true);
      console.log("[Auth] 已登入");

      // 延遲導航，讓用戶看到狀態變化
      setTimeout(() => {
        navigate("/test1");
      }, 500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-[400px] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">認證測試頁</CardTitle>
          <CardDescription>使用 Switch Button 模擬登入/登出</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 狀態顯示 */}
          <div className="text-center p-4 rounded-lg bg-slate-100">
            <p className="text-sm text-slate-600 mb-2">當前狀態</p>
            <p
              className={`text-2xl font-bold ${isLoggedIn ? "text-green-600" : "text-red-600"}`}
            >
              {isLoggedIn ? "✓ 已登入" : "✗ 未登入"}
            </p>
          </div>

          {/* Switch Button */}
          <Button
            onClick={handleToggleAuth}
            className="w-full h-12 text-lg"
            variant={isLoggedIn ? "destructive" : "default"}
          >
            {isLoggedIn ? "登出 (清除 Token)" : "登入 (設置 Token)"}
          </Button>

          {/* 說明文字 */}
          <div className="text-sm text-slate-600 space-y-2">
            <p>• 點擊按鈕模擬登入/登出</p>
            <p>• 登入會在 localStorage 設置 token</p>
            <p>• 未登入時無法訪問 /test1, /test2, /test3</p>
          </div>

          {/* 快速導航 */}
          {isLoggedIn && (
            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-slate-600 font-semibold mb-2">
                快速導航：
              </p>
              <Button
                onClick={() => navigate("/test1")}
                variant="outline"
                className="w-full"
              >
                前往測試頁面 1
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
