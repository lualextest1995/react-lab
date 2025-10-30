/**
 * TabBar 組件
 * 顯示當前打開的標籤頁，支持切換、關閉等操作
 * 自動與路由同步
 */

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTabContext } from "@/hooks/useTabContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MenuItem } from "@/contexts/AuthContext";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  ROUTE_QUERY_PREFIX_MAP,
  type RouteQueryKey,
} from "@/router/routeQueryMap";

/**
 * 動態載入 Lucide Icon 元件
 */
function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null;
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon | undefined;
  return Icon || null;
}

/**
 * 從權限樹中查找路由節點信息
 */
function findRouteNode(path: string, menuItems: MenuItem[]): MenuItem | null {
  for (const item of menuItems) {
    if (item.path === path) {
      return item;
    }
    if (item.children) {
      const found = findRouteNode(path, item.children);
      if (found) return found;
    }
  }
  return null;
}

export default function TabBar() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    switchTab,
    closeOthers,
    closeAll,
  } = useTabContext();
  const { menuItems } = useAuth();

  // 監聽路由變化，自動打開標籤
  useEffect(() => {
    const currentPath = location.pathname;

    // 首頁不需要顯示在 TabBar 上，直接返回
    if (currentPath === "/") {
      return;
    }

    // 檢查標籤是否已經存在，避免重複打開
    const existingTab = tabs.find((t) => t.id === currentPath);
    if (existingTab) {
      // 如果標籤已存在，只切換不重新打開
      if (activeTabId !== currentPath) {
        switchTab(currentPath);
      }
      return;
    }

    // 查找當前路由的信息
    const routeNode = findRouteNode(currentPath, menuItems);

    if (routeNode) {
      openTab({
        id: currentPath,
        title: routeNode.name,
        path: currentPath,
        icon: routeNode.icon,
        closable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 點擊標籤，切換路由
  const handleTabClick = (tabId: string, tabPath: string) => {
    switchTab(tabId);
    navigate(tabPath);
  };

  // 關閉標籤
  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // 防止觸發標籤點擊事件

    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.closable === false) {
      return; // 不可關閉的標籤不處理
    }

    // 根據路由路徑清理對應的查詢快取
    const queryPrefix = ROUTE_QUERY_PREFIX_MAP[tabId as RouteQueryKey];
    if (queryPrefix) {
      queryClient.removeQueries({
        predicate: (query) => {
          const firstKey = query.queryKey[0];
          if (typeof firstKey !== "string") return false;

          // 支援單一前綴或多個前綴
          const prefixes = Array.isArray(queryPrefix)
            ? queryPrefix
            : [queryPrefix];

          // 檢查 queryKey 的第一個元素是否以任一前綴開頭
          return prefixes.some((prefix) => firstKey.startsWith(prefix));
        },
      });
    }

    closeTab(tabId);

    // 如果關閉的是當前激活的標籤，需要導航到新的激活標籤
    if (tabId === activeTabId) {
      // TabsContext 會自動選擇下一個激活標籤
      // 我們需要在下一個 tick 中獲取新的 activeTabId
      setTimeout(() => {
        const remainingTabs = tabs.filter((t) => t.id !== tabId);
        if (remainingTabs.length > 0) {
          // 還有其他標籤，導航到下一個標籤
          navigate(remainingTabs[0].path);
        } else {
          // 沒有標籤了，導航到首頁
          navigate("/");
        }
      }, 0);
    }
  };

  // 關閉其他標籤
  const handleCloseOthers = (tabId: string) => {
    closeOthers(tabId);

    // 導航到保留的標籤
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  // 關閉所有標籤
  const handleCloseAll = () => {
    closeAll();
    // 關閉所有標籤後導航到首頁
    navigate("/");
  };

  // 如果沒有標籤，不顯示 TabBar
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-slate-200 px-4 flex items-center gap-1 h-10 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const Icon = getIconComponent(tab.icon);
        const closable = tab.closable !== false; // 默認可關閉

        return (
          <ContextMenu key={tab.id}>
            <ContextMenuTrigger asChild>
              <button
                onClick={() => handleTabClick(tab.id, tab.path)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-t-md text-sm transition-colors border-b-2 whitespace-nowrap",
                  isActive
                    ? "bg-slate-50 text-slate-900 border-blue-500 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                )}
              >
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                <span className="truncate max-w-[120px]">{tab.title}</span>
                {closable && (
                  <X
                    className="w-3.5 h-3.5 flex-shrink-0 hover:bg-slate-200 rounded transition-colors"
                    onClick={(e) => handleCloseTab(e, tab.id)}
                  />
                )}
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              {closable && (
                <>
                  <ContextMenuItem
                    onClick={() => {
                      closeTab(tab.id);
                      // 檢查是否需要導航
                      if (tab.id === activeTabId) {
                        setTimeout(() => {
                          const remainingTabs = tabs.filter(
                            (t) => t.id !== tab.id
                          );
                          if (remainingTabs.length > 0) {
                            navigate(remainingTabs[0].path);
                          } else {
                            navigate("/");
                          }
                        }, 0);
                      }
                    }}
                  >
                    關閉
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                </>
              )}
              <ContextMenuItem onClick={() => handleCloseOthers(tab.id)}>
                關閉其他標籤
              </ContextMenuItem>
              <ContextMenuItem onClick={handleCloseAll} variant="destructive">
                關閉所有標籤
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
}
