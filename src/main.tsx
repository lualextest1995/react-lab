import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthContextProvider from "./contexts/AuthContext";
import TabsContextProvider from "./contexts/TabsContext";
import App from "./App";
import "./index.css";

/**
 * 應用程式入口
 *
 * 架構說明：
 * 1. AuthProvider 提供認證狀態（user, token, permissionTree）
 * 2. TabsProvider 提供標籤頁狀態管理
 * 3. App 根據權限樹動態生成路由
 * 4. RouterProvider 在 App 內部動態創建
 *
 * 資料流：
 * 登入 → 取得權限樹 → permissionTree 更新 → App 重建 router → 路由更新
 * 路由變化 → TabBar 監聽 → 自動打開對應標籤
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <TabsContextProvider>
        <App />
      </TabsContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
