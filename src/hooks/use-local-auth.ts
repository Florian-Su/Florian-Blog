import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocalAuthStore {
	// State
	isLoggedIn: boolean
	loginTimestamp: number | null

	// Actions
	login: () => void
	logout: () => void
	checkExpiration: () => boolean
}

// 登录过期时间（毫秒），默认6小时
const LOGIN_EXPIRATION_TIME = 6 * 60 * 60 * 1000

export const useLocalAuthStore = create<LocalAuthStore>()(
	persist(
		(set, get) => ({
			isLoggedIn: false,
			loginTimestamp: null,

			login: () => set({ 
				isLoggedIn: true, 
				loginTimestamp: Date.now() 
			}),
			logout: () => set({ 
				isLoggedIn: false, 
				loginTimestamp: null 
			}),
			checkExpiration: () => {
				const { isLoggedIn, loginTimestamp } = get()
				if (!isLoggedIn || !loginTimestamp) {
					return false
				}
				// 检查是否过期
				const isExpired = Date.now() - loginTimestamp > LOGIN_EXPIRATION_TIME
				if (isExpired) {
					// 过期后自动登出
					get().logout()
					return true
				}
				return false
			},
		}),
		{
			name: 'local-auth-storage', // localStorage key
			// 在从存储中加载状态后检查是否过期
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.checkExpiration()
				}
			},
		}
	)
)
