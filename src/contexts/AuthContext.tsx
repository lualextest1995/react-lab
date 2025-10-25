import { createContext, type ReactNode, useReducer } from 'react'
import { MOCK_PERMISSIONS, MOCK_USERS } from '@/mocks/authMockData'

// ========== 路由型別定義 ==========

/**
 * 路由節點類型
 * - module: 模組（包含子頁面的容器，通常不可點擊）
 * - page: 頁面（可訪問的路由頁面）
 * - button: 按鈕（頁面內的操作權限，不是路由）
 */
export type RouteNodeType = 'module' | 'page' | 'button'

/**
 * 路由 Meta 資訊
 * 用於控制路由的顯示和排序
 */
export interface RouteMeta {
    /** 圖示名稱（Lucide Icons 的元件名稱） */
    icon?: string

    /** 是否在選單中隱藏 */
    hidden?: boolean

    /** 排序號碼（越小越靠前） */
    orderNum?: number
}

/**
 * 路由樹節點
 * 完整的權限路由配置，支援樹狀結構
 */
export interface RouteNode {
    /** 唯一標識 */
    id: string

    /** 顯示名稱 */
    name: string

    /** 路由路徑 */
    path: string

    /** 節點類型 */
    type: RouteNodeType

    /** 元件路徑（用於動態載入，例如 'Home', 'Test1'） */
    component?: string

    /** Meta 資訊 */
    meta?: RouteMeta

    /** 子節點（支援多層嵌套） */
    children?: RouteNode[]
}

/**
 * 選單項目
 */
export interface MenuItem {
    id: string
    name: string
    path?: string
    icon?: string
    children?: MenuItem[]
}

/**
 * 麵包屑項目
 */
export interface BreadcrumbItem {
    /** 顯示名稱 */
    name: string

    /** 路由路徑 */
    path: string

    /** 圖示 */
    icon?: ReactNode
}

// ========== 工具函數 ==========

/**
 * 拼接路徑（處理絕對路徑和相對路徑）
 */
function joinPath(parent: string, child: string): string {
    if (child.startsWith('/')) return child
    if (!parent) return `/${child}`
    return `${parent}/${child}`
}

/**
 * 從路由樹生成選單資料
 */
function generateMenuFromTree(tree: RouteNode[], parentPath = ''): MenuItem[] {
    return tree
        .filter((node) => !node.meta?.hidden && node.type !== 'button')
        .sort((a, b) => (a.meta?.orderNum || 0) - (b.meta?.orderNum || 0))
        .map((node) => {
            const path = node.type === 'page' ? joinPath(parentPath, node.path) : node.path
            const nextParent = path || parentPath

            return {
                id: node.id,
                name: node.name,
                icon: node.meta?.icon,
                path: node.type === 'page' ? path : undefined,
                children: node.children?.length
                    ? generateMenuFromTree(node.children, nextParent)
                    : undefined,
            }
        })
}

// ========== Auth 型別定義 ==========

export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    roles: string[] // 使用者角色列表
}

type AuthState = {
    user: User | null
    token: string | null
    permissionTree: RouteNode[]
    menuItems: MenuItem[]
    isAuthenticated: boolean
}

type AuthContextValue = AuthState & {
    login: (userType: keyof typeof MOCK_PERMISSIONS) => void
    logout: () => void
}

type AuthContextProviderProps = {
    children: ReactNode
}

type LoginAction = {
    type: 'LOGIN'
    payload: {
        user: User
        token: string
        permissionTree: RouteNode[]
    }
}

type LogoutAction = {
    type: 'LOGOUT'
}

type Action = LoginAction | LogoutAction

// ========== LocalStorage 工具函數 ==========

const AUTH_USER_KEY = 'auth_user'
const TOKEN_KEY = 'token'
const PERMISSION_TREE_KEY = 'permission_tree'

/**
 * 從 localStorage 讀取初始狀態
 */
function loadStateFromStorage(): Pick<AuthState, 'user' | 'token' | 'permissionTree'> {
    try {
        const user = localStorage.getItem(AUTH_USER_KEY)
        const token = localStorage.getItem(TOKEN_KEY)
        const permissionTree = localStorage.getItem(PERMISSION_TREE_KEY)

        return {
            user: user ? JSON.parse(user) : null,
            token: token || null,
            permissionTree: permissionTree ? JSON.parse(permissionTree) : [],
        }
    } catch (error) {
        console.error('[Auth] 讀取 localStorage 失敗:', error)
        return {
            user: null,
            token: null,
            permissionTree: [],
        }
    }
}

/**
 * 儲存狀態到 localStorage
 */
function saveStateToStorage(state: Pick<AuthState, 'user' | 'token' | 'permissionTree'>): void {
    try {
        if (state.user) {
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(state.user))
        } else {
            localStorage.removeItem(AUTH_USER_KEY)
        }

        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token)
        } else {
            localStorage.removeItem(TOKEN_KEY)
        }

        if (state.permissionTree.length > 0) {
            localStorage.setItem(PERMISSION_TREE_KEY, JSON.stringify(state.permissionTree))
        } else {
            localStorage.removeItem(PERMISSION_TREE_KEY)
        }
    } catch (error) {
        console.error('[Auth] 儲存到 localStorage 失敗:', error)
    }
}

// ========== Reducer ==========

const initialState: AuthState = {
    ...loadStateFromStorage(),
    menuItems: [],
    isAuthenticated: false,
}

// 在初始化時計算 menuItems 和 isAuthenticated
initialState.menuItems = generateMenuFromTree(initialState.permissionTree)
initialState.isAuthenticated = !!(initialState.token && initialState.user)

const authReducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case 'LOGIN': {
            const { user, token, permissionTree } = action.payload
            const menuItems = generateMenuFromTree(permissionTree)

            const newState: AuthState = {
                user,
                token,
                permissionTree,
                menuItems,
                isAuthenticated: true,
            }

            // 持久化到 localStorage
            saveStateToStorage({ user, token, permissionTree })
            console.log(`[Auth] 登入成功: ${user.name}`)
            console.log('[Auth] 權限樹:', permissionTree)

            return newState
        }
        case 'LOGOUT': {
            const newState: AuthState = {
                user: null,
                token: null,
                permissionTree: [],
                menuItems: [],
                isAuthenticated: false,
            }

            // 清除 localStorage
            saveStateToStorage({ user: null, token: null, permissionTree: [] })
            console.log('[Auth] 登出成功')

            return newState
        }
        default:
            return state
    }
}

// ========== Context 定義 ==========

export const AuthContext = createContext<AuthContextValue | null>(null)

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [authState, dispatch] = useReducer(authReducer, initialState)

    const authCtx: AuthContextValue = {
        user: authState.user,
        token: authState.token,
        permissionTree: authState.permissionTree,
        menuItems: authState.menuItems,
        isAuthenticated: authState.isAuthenticated,
        login: (userType) => {
            const mockUser = MOCK_USERS[userType]
            const mockToken = `mock-token-${userType}-${Date.now()}`
            const mockPermissionTree = MOCK_PERMISSIONS[userType]

            dispatch({
                type: 'LOGIN',
                payload: {
                    user: mockUser,
                    token: mockToken,
                    permissionTree: mockPermissionTree,
                },
            })
        },
        logout: () => dispatch({ type: 'LOGOUT' }),
    }

    return <AuthContext.Provider value={authCtx}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
