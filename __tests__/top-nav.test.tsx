import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { TopNav } from '../components/TopNav'

afterEach(() => {
	cleanup()
})

describe('TopNav', () => {
	test('renders navigation and dispatches events in primary view', async () => {
		const setCurrentPage = vi.fn()
		const onAuthClick = vi.fn()
		const user = userEvent.setup()

		render(
			<TopNav
				currentPage="home"
				setCurrentPage={setCurrentPage}
				user={null}
				onAuthClick={onAuthClick}
				theme="light"
			/>
		)

		const projectsButton = screen.getByRole('button', { name: /projects/i })
		await user.click(projectsButton)
		expect(setCurrentPage).toHaveBeenCalledWith('projects')

		const accountButton = screen.getByRole('button', { name: /account/i })
		expect(accountButton).toBeDisabled()

		const signInButton = screen.getByRole('button', { name: /sign in/i })
		await user.click(signInButton)
		expect(onAuthClick).toHaveBeenCalled()
	})

	test('shows back button when in detail view', async () => {
		const onBackFromProjectDetail = vi.fn()
		const user = userEvent.setup()

		render(
			<TopNav
				currentPage="project-detail"
				onBackFromProjectDetail={onBackFromProjectDetail}
				setCurrentPage={vi.fn()}
				user={null}
				onAuthClick={vi.fn()}
				theme="light"
			/>
		)

		const backButton = screen.getByRole('button', { name: /projects/i })
		await user.click(backButton)
		expect(onBackFromProjectDetail).toHaveBeenCalled()
	})

	test('enables account navigation when user is present', async () => {
		const setCurrentPage = vi.fn()
		const user = userEvent.setup()

		render(
			<TopNav
				currentPage="home"
				setCurrentPage={setCurrentPage}
				user={{ id: '1' }}
				onAuthClick={vi.fn()}
				theme="light"
			/>
		)

		const accountButton = screen.getByRole('button', { name: /account/i })
		expect(accountButton).not.toBeDisabled()
		await user.click(accountButton)
		expect(setCurrentPage).toHaveBeenLastCalledWith('account')
	})
})

