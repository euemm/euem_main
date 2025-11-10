'use client'

import { useState, useEffect } from 'react'
import { TopNav } from '../../components/TopNav'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ScrollToTopButton } from '../../components/ToggleButton'
import { ProjectsPage } from '../../components/ProjectsPage'
import { ProjectDetailPage } from '../../components/ProjectDetailPage'
import { AuthDialog } from '../../components/AuthDialog'
import type { AuthUser, AuthResponse } from '../../lib/auth-api'
import { getProfile } from '../../lib/auth-api'
import { clearStoredAuthSession, getStoredAuthSession, storeAuthSession, updateStoredUser } from '../../lib/auth-storage'

export default function Projects() {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [theme, setTheme] = useState<'light' | 'dark'>('light')
	const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
	const [selectedProject, setSelectedProject] = useState<any>(null)
	const [showProjectDetail, setShowProjectDetail] = useState(false)
	const [isRestoringSession, setIsRestoringSession] = useState(false)

	const handleAuthClick = () => {
		if (user) {
			handleLogout()
		} else {
			setIsAuthDialogOpen(true)
		}
	}

	const handleAuthSuccess = (session: AuthResponse) => {
		setUser(session.user)
		storeAuthSession(session)
		setIsAuthDialogOpen(false)
	}

	const handleLogout = () => {
		clearStoredAuthSession()
		setUser(null)
	}

	const handleProjectClick = (project: any) => {
		setSelectedProject(project)
		setShowProjectDetail(true)
	}

	const handleBackFromProjectDetail = () => {
		setShowProjectDetail(false)
		setSelectedProject(null)
	}

	const handleThemeChange = (newTheme: 'light' | 'dark') => {
		setTheme(newTheme)
		if (newTheme === 'dark') {
			document.documentElement.classList.add('dark')
			document.body.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
			document.body.classList.remove('dark')
		}
	}

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
		const initialTheme = savedTheme || 'light'
		setTheme(initialTheme)
		if (initialTheme === 'dark') {
			document.documentElement.classList.add('dark')
			document.body.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
			document.body.classList.remove('dark')
		}
	}, [])

	useEffect(() => {
		localStorage.setItem('theme', theme)
	}, [theme])

	useEffect(() => {
		if (typeof window === 'undefined') return
		const stored = getStoredAuthSession()
		if (!stored) return

		setIsRestoringSession(true)
		setUser(stored.user)

		let isCancelled = false

		const syncProfile = async () => {
			try {
				const profile = await getProfile(stored.accessToken)
				if (!isCancelled) {
					setUser(profile)
					updateStoredUser(profile)
				}
			} catch {
				if (!isCancelled) {
					clearStoredAuthSession()
					setUser(null)
				}
			} finally {
				if (!isCancelled) {
					setIsRestoringSession(false)
				}
			}
		}

		void syncProfile()

		return () => {
			isCancelled = true
		}
	}, [])

	return (
		<>
			<TopNav
				currentPage="projects"
				setCurrentPage={() => {}}
				user={user}
				onAuthClick={handleAuthClick}
				theme={theme}
				onBackFromProjectDetail={handleBackFromProjectDetail}
			/>
			<main className="min-h-screen bg-background pt-20">
				{!showProjectDetail ? (
					<ProjectsPage onProjectClick={handleProjectClick} />
				) : (
					selectedProject && (
						<ProjectDetailPage 
							project={selectedProject}
							onBack={handleBackFromProjectDetail}
						/>
					)
				)}
			</main>
			<ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
			<ScrollToTopButton />
			<AuthDialog
				isOpen={isAuthDialogOpen}
				onClose={() => setIsAuthDialogOpen(false)}
				onAuthSuccess={handleAuthSuccess}
			/>
			{isRestoringSession && (
				<div className="fixed inset-0 pointer-events-none" aria-hidden="true" />
			)}
		</>
	)
}
