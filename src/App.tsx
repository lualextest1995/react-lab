import { useMemo } from "react";
import { RouterProvider } from "react-router";
import { useAuth } from "./hooks/useAuth";
import { createAppRouter } from "./router";

/**
 * 應用程式根元件
 *
 * 負責根據使用者的權限樹和登入狀態動態生成路由
 * 使用 useMemo 優化效能，只在 permissionTree 或 isAuthenticated 變化時重建 router
 */
export default function App() {
  const { permissionTree, isAuthenticated } = useAuth();

  // 動態生成路由：只在 permissionTree 或 isAuthenticated 變化時重建
  const router = useMemo(() => {
    console.log("[App] 權限樹或登入狀態變更，重新生成路由");
    console.log("[App] 權限樹:", permissionTree);
    console.log("[App] 登入狀態:", isAuthenticated);

    return createAppRouter(permissionTree, isAuthenticated);
  }, [permissionTree, isAuthenticated]);

  return <RouterProvider router={router} />;
}
