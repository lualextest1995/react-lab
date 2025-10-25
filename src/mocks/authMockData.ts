import type { RouteNode, User } from '@/contexts/AuthContext'

/**
 * Mock 權限樹
 * 實際專案中這些資料會從後端 API 取得
 */
export const MOCK_PERMISSIONS: Record<string, RouteNode[]> = {
    admin: [
        {
            id: 'home',
            name: '首頁',
            path: '/',
            type: 'page',
            component: 'Home',
            meta: {
                icon: 'Home',
                orderNum: 0,
            },
        },
        {
            id: 'test-module',
            name: '測試模組',
            path: '/test',
            type: 'module',
            meta: {
                icon: 'TestTube',
                orderNum: 1,
            },
            children: [
                {
                    id: 'test1',
                    name: '測試頁面 1',
                    path: 'test1',
                    type: 'page',
                    component: 'Test1',
                    meta: {
                        icon: 'FileText',
                    },
                },
                {
                    id: 'test2',
                    name: '測試頁面 2',
                    path: 'test2',
                    type: 'page',
                    component: 'Test2',
                    meta: {
                        icon: 'FileCode',
                    },
                },
                {
                    id: 'test3',
                    name: '測試頁面 3',
                    path: 'test3',
                    type: 'page',
                    component: 'Test3',
                    meta: {
                        icon: 'FileCheck',
                    },
                },
            ],
        },
    ],
    user: [
        {
            id: 'home',
            name: '首頁',
            path: '/',
            type: 'page',
            component: 'Home',
            meta: {
                icon: 'Home',
                orderNum: 0,
            },
        },
        {
            id: 'test1',
            name: '測試頁面 1',
            path: '/test1',
            type: 'page',
            component: 'Test1',
            meta: {
                icon: 'FileText',
            },
        },
    ],
    guest: [
        {
            id: 'home',
            name: '首頁',
            path: '/',
            type: 'page',
            component: 'Home',
            meta: {
                icon: 'Home',
            },
        },
    ],
}

/**
 * Mock 使用者資料
 */
export const MOCK_USERS: Record<
    keyof typeof MOCK_PERMISSIONS,
    Omit<User, 'roles'> & { roles: string[] }
> = {
    admin: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        roles: ['admin'],
    },
    user: {
        id: '2',
        name: 'Normal User',
        email: 'user@example.com',
        roles: ['user'],
    },
    guest: {
        id: '3',
        name: 'Guest User',
        email: 'guest@example.com',
        roles: ['guest'],
    },
}
