/**
 * 動態側邊欄元件
 * 接收選單資料並渲染多層級側邊欄
 * 負責圖示的動態載入和 UI 渲染
 */

import { useState } from "react";
import { Link, useLocation } from "react-router";
import type { MenuItem } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ========== 工具函數 ==========

/**
 * 動態載入 Lucide Icon 元件
 * 返回元件而非元件實例，避免不必要的重新創建
 */
function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null;

  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon | undefined;

  if (!Icon) {
    console.warn(`[DynamicSidebar] 找不到圖示: ${iconName}`);
    return null;
  }

  return Icon;
}

// ========== 元件定義 ==========

interface DynamicSidebarProps {
  menuItems: MenuItem[];
}

export default function DynamicSidebar({ menuItems }: DynamicSidebarProps) {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 切換模組的展開/收合狀態
  const toggleOpen = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // 渲染選單項目
  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = getIconComponent(item.icon);
    const hasChildren = item.children?.length ?? false;
    const isOpen = openKeys.includes(item.id);
    const isActive = item.path === location.pathname;

    // 共用的圖示和標籤部分
    const iconAndLabel = (
      <>
        {Icon && <Icon className="w-4 h-4" />}
        <span>{item.name}</span>
      </>
    );

    // 模組節點（有子選單）
    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleOpen(item.id)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-700/50",
              level > 0 && "pl-6"
            )}
          >
            <div className="flex items-center gap-2">{iconAndLabel}</div>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {isOpen && item.children && (
            <div className="ml-2 mt-1">
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // 頁面節點（可點擊）
    return (
      <Link
        key={item.id}
        to={item.path || "#"}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm mb-1",
          level > 0 && "pl-6",
          isActive
            ? "bg-slate-700 text-white font-semibold"
            : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
        )}
      >
        {iconAndLabel}
      </Link>
    );
  };

  return (
    <ScrollArea className="h-full px-2 py-4">
      <div className="space-y-1">
        {menuItems.length > 0 ? (
          menuItems.map((item) => renderMenuItem(item))
        ) : (
          <div className="px-3 py-2 text-sm text-slate-400 text-center">
            沒有可用的選單項目
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
