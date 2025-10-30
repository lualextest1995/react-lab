/**
 * 路由與查詢鍵值前綴對應表
 * 用於管理頁面關閉時需要清理的 TanStack Query 快取
 *
 * 使用方式：
 * 1. 在頁面元件中：import 並使用對應的前綴定義 queryKey
 *    例如：queryKey: ['test1-list', page] 或 queryKey: ['test1-options']
 * 2. 在 TabBar 中：根據路由路徑自動清理所有以該前綴開頭的查詢快取
 *
 * 前綴格式：
 * - 字串：會清理 queryKey 第一個元素「以此字串開頭」的所有查詢
 *   例如：'test1-' 會清理 ['test1-list'], ['test1-options'], ['test1-detail'] 等
 * - 字串陣列：會清理 queryKey 符合陣列中「任一前綴開頭」的查詢
 *   例如：['test1-', 'shared-'] 會清理 ['test1-list'] 和 ['shared-config'] 等
 */
export const ROUTE_QUERY_PREFIX_MAP = {
  // Test1 頁面（支援不同角色的路徑）
  '/test1': 'test1-',        // user 角色：絕對路徑
  '/test/test1': 'test1-',   // admin 角色：在 /test 模組底下

  // Test2 頁面
  '/test2': 'test2-',
  '/test/test2': 'test2-',

  // Test3 頁面
  '/test3': 'test3-',
  '/test/test3': 'test3-',
} as const;

/**
 * 路由查詢鍵值的型別
 */
export type RouteQueryKey = keyof typeof ROUTE_QUERY_PREFIX_MAP;

/**
 * 查詢前綴的型別（可能是單一字串或字串陣列）
 */
export type QueryPrefix = typeof ROUTE_QUERY_PREFIX_MAP[RouteQueryKey];
