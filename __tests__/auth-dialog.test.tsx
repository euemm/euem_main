import React from 'react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { AuthDialog } from '../components/AuthDialog'
import type { AuthResponse } from '../lib/auth-api'
import { login, registerUser, verifyEmail } from '../lib/auth-api'
import { act } from 'react'

vi.mock('../lib/auth-api', () => ({
	login: vi.fn(),
	registerUser: vi.fn(),
	verifyEmail: vi.fn(),
	resendVerificationCode: vi.fn(),
}))

const mockedLogin = login as unknown as vi.Mock
const mockedRegister = registerUser as unknown as vi.Mock
const mockedVerify = verifyEmail as unknown as vi.Mock

const sampleSession: AuthResponse = {
	accessToken: 'fake-token',
	tokenType: 'Bearer',
	expiresIn: 3600_000,
	user: {
		id: 'user-1',
		email: 'test@example.com',
		firstName: 'Test',
		lastName: 'User',
		isVerified: true,
		isEnabled: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		roles: ['USER'],
	},
}

afterEach(() => {
	vi.clearAllMocks()
	cleanup()
})

describe('AuthDialog', () => {
	test('sign-in flow calls login API and reports success', async () => {
		const onAuthSuccess = vi.fn()
		const onClose = vi.fn()
		mockedLogin.mockResolvedValueOnce(sampleSession)

		render(
			<AuthDialog
				isOpen
				onClose={onClose}
				onAuthSuccess={onAuthSuccess}
			/>
		)

		const user = userEvent.setup()

		await act(async () => {
			await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
			await user.type(screen.getByLabelText(/^password$/i), 'password123!')
			await user.click(screen.getByRole('button', { name: /sign in/i }))
		})

		await waitFor(() => {
			expect(mockedLogin).toHaveBeenCalledWith('test@example.com', 'password123!')
			expect(onAuthSuccess).toHaveBeenCalledWith(sampleSession)
		})

		await waitFor(() => expect(onClose).toHaveBeenCalled())
	})

	test('registration + verification flow creates account and auto logs in', async () => {
		const onAuthSuccess = vi.fn()
		const onClose = vi.fn()

		mockedRegister.mockResolvedValueOnce({
			...sampleSession.user,
			isVerified: false,
		})
		mockedVerify.mockResolvedValueOnce({ message: 'ok', success: true })
		mockedLogin.mockResolvedValueOnce(sampleSession)

		render(
			<AuthDialog
				isOpen
				onClose={onClose}
				onAuthSuccess={onAuthSuccess}
			/>
		)

		const user = userEvent.setup()

		await act(async () => {
			await user.click(screen.getByRole('button', { name: /sign up/i }))
		})

		await waitFor(() => expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument())

		await act(async () => {
			await user.type(screen.getByLabelText(/full name/i), 'Test User')
			await user.type(screen.getByLabelText(/email address/i), 'new@example.com')
			await user.type(screen.getByLabelText(/^password$/i), 'password123!')
			await user.type(screen.getByLabelText(/confirm password/i), 'password123!')
			await user.click(screen.getByRole('button', { name: /create account/i }))
		})

		await waitFor(() => {
			expect(mockedRegister).toHaveBeenCalledWith({
				email: 'new@example.com',
				password: 'password123!',
				firstName: 'Test',
				lastName: 'User',
			})
		})

		await waitFor(() => {
			expect(screen.getByText(/verify your email/i)).toBeInTheDocument()
		})

		const code = '123456'
		const codeInputs = screen.getAllByRole('textbox')
		expect(codeInputs).toHaveLength(6)
		await act(async () => {
			for (let index = 0; index < codeInputs.length; index += 1) {
				await user.type(codeInputs[index], code[index])
			}

			await user.click(screen.getByRole('button', { name: /verify email/i }))
		})

		await waitFor(() => {
			expect(mockedVerify).toHaveBeenCalledWith('123456')
			expect(mockedLogin).toHaveBeenCalledWith('new@example.com', 'password123!')
			expect(onAuthSuccess).toHaveBeenCalledWith(sampleSession)
		})

		await waitFor(() => expect(onClose).toHaveBeenCalled(), {
			timeout: 2000,
		})
	})
})

