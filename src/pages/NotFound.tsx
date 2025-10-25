import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 倒數計時
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <Card className="w-[500px] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-red-600 mb-4">
            404
          </CardTitle>
          <CardTitle className="text-3xl">頁面不存在</CardTitle>
          <CardDescription className="text-base mt-2">
            您訪問的頁面不存在或您沒有權限訪問
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 倒數計時 */}
          <div className="text-center p-6 rounded-lg bg-slate-100">
            <p className="text-sm text-slate-600 mb-2">自動跳轉中</p>
            <p className="text-5xl font-bold text-orange-600">{countdown}</p>
            <p className="text-sm text-slate-600 mt-2">秒後返回首頁</p>
          </div>

          {/* 立即跳轉按鈕 */}
          <Button
            onClick={handleGoHome}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            立即返回首頁
          </Button>

          {/* 說明文字 */}
          <div className="text-sm text-slate-600 space-y-2 pt-4 border-t">
            <p className="font-semibold">可能的原因：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>頁面路徑輸入錯誤</li>
              <li>您沒有訪問此頁面的權限</li>
              <li>頁面已被移除或不存在</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
