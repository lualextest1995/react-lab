import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

/**
 * useAuth Hook
 *
 * 用於在元件中存取 AuthContext 的自定義 hook
 * 提供型別安全的 Context 存取
 *
 * @throws 如果在 AuthProvider 外部使用會拋出錯誤
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *
 *   return (
 *     <div>
 *       {isAuthenticated ? (
 *         <>
 *           <p>歡迎, {user?.name}</p>
 *           <button onClick={logout}>登出</button>
 *         </>
 *       ) : (
 *         <button onClick={() => login('admin')}>登入</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
    const context = useContext(AuthContext)

    if (context === null) {
        throw new Error('useAuth 必須在 AuthProvider 內部使用')
    }

    return context
}
