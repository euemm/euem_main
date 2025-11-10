import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { AccountPage } from '../components/AccountPage'
import type { AuthUser } from '../lib/auth-api'
import { act } from 'react'

afterEach(() => {
	cleanup()
})

const sampleUser: AuthUser = {
	id: 'user-1',
	email: 'user@example.com',
	firstName: 'Test',
	lastName: 'User',
	isVerified: true,
	isEnabled: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	roles: ['USER'],
}

describe('AccountPage', () => {
	test('renders guest view when no user is provided', () => {
		render(
			<AccountPage
				user={null}
				onLogout={vi.fn()}
			/>
		)

		expect(screen.getByText(/account required/i)).toBeInTheDocument()
		expect(screen.getByText(/please sign in to access your account settings/i)).toBeInTheDocument()
	})

	test('renders account details and handles actions for authenticated user', async () => {
		const onLogout = vi.fn()
		const onPasswordChange = vi.fn()
		const onEmailChange = vi.fn()
		const onAccountDelete = vi.fn()
		const user = userEvent.setup()

		render(
			<AccountPage
				user={sampleUser}
				onLogout={onLogout}
				onPasswordChange={onPasswordChange}
				onEmailChange={onEmailChange}
				onAccountDelete={onAccountDelete}
			/>
		)

		expect(screen.getByText('Test User')).toBeInTheDocument()
		expect(screen.getByText(sampleUser.email)).toBeInTheDocument()

		await act(async () => {
			await user.click(screen.getByRole('button', { name: /change password/i }))
		})
		expect(onPasswordChange).toHaveBeenCalled()

		await act(async () => {
			await user.click(screen.getByRole('button', { name: /change email/i }))
		})
		expect(onEmailChange).toHaveBeenCalled()

		await act(async () => {
			await user.click(screen.getByRole('button', { name: /remove account/i }))
		})
		expect(screen.getByRole('heading', { name: /delete account/i })).toBeInTheDocument()

		await act(async () => {
			await user.click(screen.getByRole('button', { name: /delete account/i }))
		})
		expect(onAccountDelete).toHaveBeenCalled()

		await act(async () => {
			await user.click(screen.getByRole('button', { name: /sign out/i }))
		})
		expect(onLogout).toHaveBeenCalled()
	})
})

