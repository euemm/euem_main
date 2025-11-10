'use client'

declare const process: {
	env?: {
		NEXT_PUBLIC_API_BASE_URL?: string
	}
}

const apiBaseFromEnv =
	typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL
		? process.env.NEXT_PUBLIC_API_BASE_URL
		: undefined

const API_BASE_URL = apiBaseFromEnv ?? 'https://euem.net/api'

type FetchOptions = Omit<RequestInit, 'headers'> & {
	headers?: Record<string, string>
	authToken?: string | null
}

type ApiErrorBody = {
	message?: string
	error?: string
	details?: string | string[]
}

const defaultHeaders: Record<string, string> = {
	'Content-Type': 'application/json',
}

async function parseJson(response: Response) {
	const text = await response.text()
	if (!text) {
		return null
	}
	try {
		return JSON.parse(text)
	} catch {
		return null
	}
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
	const { authToken, headers, ...init } = options
	const mergedHeaders: Record<string, string> = {
		...defaultHeaders,
		...(headers ?? {}),
	}

	if (authToken) {
		mergedHeaders.Authorization = `Bearer ${authToken}`
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: mergedHeaders,
	})

	const data = await parseJson(response)

	if (!response.ok) {
		const errorBody = data as ApiErrorBody | null
		const message =
			errorBody?.message ||
			errorBody?.error ||
			(Array.isArray(errorBody?.details) ? errorBody?.details.join(', ') : errorBody?.details) ||
			`Request failed with status ${response.status}`
		throw new Error(message)
	}

	return data as T
}

export type AuthUser = {
	id: string
	email: string
	firstName: string
	lastName: string
	isVerified: boolean
	isEnabled: boolean
	createdAt: string
	updatedAt: string
	roles: string[]
}

export type AuthResponse = {
	accessToken: string
	tokenType: string
	expiresIn: number
	user: AuthUser
}

export type RegisterPayload = {
	email: string
	password: string
	firstName: string
	lastName: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
	return request<AuthResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	})
}

export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
	return request<AuthUser>('/auth/register', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
}

export async function verifyEmail(otpCode: string): Promise<{ message: string; success: boolean }> {
	return request<{ message: string; success: boolean }>('/auth/verify-email', {
		method: 'POST',
		body: JSON.stringify({ otpCode }),
	})
}

export async function resendVerificationCode(email: string): Promise<{ message: string; success: boolean }> {
	return request<{ message: string; success: boolean }>(`/auth/resend-otp?email=${encodeURIComponent(email)}`, {
		method: 'POST',
	})
}

export async function getProfile(authToken: string): Promise<AuthUser> {
	return request<AuthUser>('/users/profile', {
		method: 'GET',
		authToken,
	})
}

