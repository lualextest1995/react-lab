/**
 * 路由主檔案
 * 整合所有路由相關邏輯：靜態路由、元件映射、工具函數、動態路由生成
 */

import { createBrowserRouter, type RouteObject, Navigate, Outlet } from "react-router";
import { Suspense, lazy, type ComponentType } from "react";
import type { RouteNode } from "@/contexts/AuthContext";
import { loggingMiddleware } from "@/middleware/logging";
import MainLayout from "@/layouts/MainLayout";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import type { LoaderFunction } from "react-router";

// 直接導入 loader 函數
import { loader as homeLoader } from "@/pages/Home";
import { loader as test1Loader } from "@/pages/Test1";
import { loader as test2Loader } from "@/pages/Test2";
import { loader as test3Loader } from "@/pages/Test3";
import { loader as test4Loader } from "@/pages/Test4";

// ========== 元件映射表 ==========

/**
 * 元件映射表
 * key: 元件路徑字串（與 RouteNode.component 對應）
 * value: 動態導入的元件
 *
 * 使用 lazy 載入實現代碼分割，提升首屏載入速度
 */
const componentMap: Record<string, ComponentType> = {
  // 現有頁面元件
  Home: lazy(() => import("@/pages/Home")),
  Test1: lazy(() => import("@/pages/Test1")),
  Test2: lazy(() => import("@/pages/Test2")),
  Test3: lazy(() => import("@/pages/Test3")),
  Test4: lazy(() => import("@/pages/Test4")),

  // 未來可以繼續新增元件映射
  // 例如：
  // Dashboard: lazy(() => import('@/pages/Dashboard')),
  // 'system/users': lazy(() => import('@/pages/system/UserManagement')),
  // 'system/roles': lazy(() => import('@/pages/system/RoleManagement')),
};

/**
 * Loader 映射表
 * 直接引用 loader 函數（不使用 lazy loading）
 */
const loaderMap: Record<string, LoaderFunction> = {
  Home: homeLoader,
  Test1: test1Loader,
  Test2: test2Loader,
  Test3: test3Loader,
  Test4: test4Loader,
};

/**
 * 根據字串路徑載入元件
 */
function loadComponent(componentPath?: string): ComponentType | null {
  if (!componentPath) {
    return null;
  }

  const Component = componentMap[componentPath];

  if (!Component) {
    console.warn(`[ComponentMap] 找不到元件: ${componentPath}`);
    return null;
  }

  return Component;
}

/**
 * 根據字串路徑載入 loader
 */
function loadLoader(componentPath?: string): LoaderFunction | undefined {
  if (!componentPath) {
    return undefined;
  }

  return loaderMap[componentPath];
}

// ========== 路由工具函數 ==========

/**
 * 拼接路徑（處理絕對路徑和相對路徑）
 */
function joinPath(parent: string, child: string): string {
  if (child.startsWith('/')) return child;
  if (!parent) return `/${child}`;
  return `${parent}/${child}`;
}

/**
 * 扁平化路由樹
 * 將樹狀結構轉換為一維陣列
 */
export function flattenRouteTree(tree: RouteNode[]): RouteNode[] {
  const result: RouteNode[] = [];

  function traverse(nodes: RouteNode[]) {
    nodes.forEach((node) => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  }

  traverse(tree);
  return result;
}

/**
 * 根據路徑查找路由節點
 */
export function findNodeByPath(
  tree: RouteNode[],
  path: string
): RouteNode | null {
  for (const node of tree) {
    if (node.path === path) {
      return node;
    }
    if (node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * 收集所有路由路徑（用於權限檢查）
 */
export function collectAllPaths(tree: RouteNode[], parentPath = ""): string[] {
  const paths: string[] = [];

  function traverse(nodes: RouteNode[], parent: string) {
    for (const node of nodes) {
      if (node.type === "button") {
        if (node.children) traverse(node.children, parent);
        continue;
      }

      const path = joinPath(parent, node.path);
      paths.push(path);

      if (node.children) traverse(node.children, path);
    }
  }

  traverse(tree, parentPath);
  return paths;
}

/**
 * 過濾出可見的路由（用於生成選單）
 * 會移除 meta.hidden 為 true 的節點
 */
export function filterVisibleRoutes(tree: RouteNode[]): RouteNode[] {
  return tree
    .filter((node) => !node.meta?.hidden)
    .map((node) => ({
      ...node,
      children: node.children
        ? filterVisibleRoutes(node.children)
        : undefined,
    }));
}

/**
 * 排序路由樹（根據 meta.orderNum）
 */
export function sortRouteTree(tree: RouteNode[]): RouteNode[] {
  const sorted = [...tree].sort(
    (a, b) => (a.meta?.orderNum || 0) - (b.meta?.orderNum || 0)
  );

  return sorted.map((node) => ({
    ...node,
    children: node.children ? sortRouteTree(node.children) : undefined,
  }));
}

// ========== 動態路由生成 ==========

/**
 * 遞迴將權限樹轉換為 React Router 路由配置
 *
 * @param nodes 路由樹節點陣列
 * @returns React Router 路由物件陣列
 */
function transformTreeToRoutes(nodes: RouteNode[]): RouteObject[] {
  return nodes
    .filter((node) => node.type !== "button") // 過濾掉按鈕類型
    .map((node) => {
      const Component = loadComponent(node.component);
      const loader = loadLoader(node.component);

      const route: RouteObject = {
        path: node.path,
        element: Component ? (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-slate-500">Loading...</div>
              </div>
            }
          >
            <Component />
          </Suspense>
        ) : (
          <Outlet />
        ),
      };

      // 加入 loader（如果有）
      if (loader) {
        route.loader = loader;
      }

      // 遞迴處理子路由
      if (node.children && node.children.length > 0) {
        const childRoutes = transformTreeToRoutes(node.children);
        if (childRoutes.length > 0) {
          route.children = childRoutes;
        }
      }

      return route;
    });
}

/**
 * 建立路由實例
 * 根據權限樹和登入狀態動態生成路由
 *
 * @param permissionTree 權限樹（從後端或 Mock 取得）
 * @param isAuthenticated 是否已登入
 * @returns React Router 實例
 *
 * 路由邏輯：
 * - 未登入：只能訪問 /login，其他路由重定向到 /login
 * - 已登入：可訪問動態路由，訪問 /login 重定向到 /
 */
export function createAppRouter(
  permissionTree: RouteNode[] = [],
  isAuthenticated: boolean = false
) {
  console.log("[Router] 建立路由，權限樹:", permissionTree);
  console.log("[Router] 登入狀態:", isAuthenticated);

  // 動態生成的路由
  const dynamicRoutes = transformTreeToRoutes(permissionTree);

  // 未登入：只有登入頁
  if (!isAuthenticated) {
    return createBrowserRouter([
      {
        path: "/login",
        element: <Login />,
        middleware: [loggingMiddleware],
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ]);
  }

  // 已登入：完整路由表
  return createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      middleware: [loggingMiddleware],
      children: dynamicRoutes,
    },
    {
      path: "/login",
      element: <Navigate to="/" replace />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}
