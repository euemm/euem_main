'use client'

import type { AuthResponse, AuthUser } from './auth-api'

export type StoredAuthSession = AuthResponse

const STORAGE_KEY = 'euem_auth_session'

export function storeAuthSession(session: StoredAuthSession) {
	if (typeof window === 'undefined') return
	localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function getStoredAuthSession(): StoredAuthSession | null {
	if (typeof window === 'undefined') return null
	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) return null
	try {
		return JSON.parse(raw) as StoredAuthSession
	} catch {
		return null
	}
}

export function clearStoredAuthSession() {
	if (typeof window === 'undefined') return
	localStorage.removeItem(STORAGE_KEY)
}

export function updateStoredUser(user: AuthUser) {
	if (typeof window === 'undefined') return
	const current = getStoredAuthSession()
	if (!current) return
	const updated = { ...current, user }
	storeAuthSession(updated)
}

