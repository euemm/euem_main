'use client'

import { useState, useEffect } from 'react'
import { TopNav } from '../components/TopNav'
import { ThemeToggle } from '../components/ThemeToggle'
import { ScrollToTopButton } from '../components/ToggleButton'
import { HomePage } from '../components/HomePage'
import { ProjectsPage } from '../components/ProjectsPage'
import { ProjectDetailPage } from '../components/ProjectDetailPage'
import { AccountPage } from '../components/AccountPage'
import { AuthDialog } from '../components/AuthDialog'

export default function Home() {
	const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'account' | 'project-detail' | 'skill-detail'>('home')
	const [user, setUser] = useState(null)
	const [theme, setTheme] = useState<'light' | 'dark'>('light')
	const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
	const [selectedProject, setSelectedProject] = useState<any>(null)
	const [isNavigatingFromHistory, setIsNavigatingFromHistory] = useState(false)

	const handleAuthClick = () => {
		if (user) {
			// If user is logged in, log them out
			setUser(null)
		} else {
			// If user is not logged in, open auth dialog
			setIsAuthDialogOpen(true)
		}
	}

	const handleAuthSuccess = (userData: any) => {
		setUser(userData)
		setIsAuthDialogOpen(false)
	}

	const handleLogout = () => {
		setUser(null)
		setCurrentPage('home')
	}

	const handlePasswordChange = () => {
		// TODO: Implement password change functionality
		console.log('Change password clicked')
	}

	const handleEmailChange = () => {
		// TODO: Implement email change functionality
		console.log('Change email clicked')
	}

	const handleAccountDelete = () => {
		// TODO: Implement account deletion functionality
		console.log('Delete account clicked')
		setUser(null)
		setCurrentPage('home')
	}

	const handleProjectClick = (project: any) => {
		setSelectedProject(project)
		setCurrentPage('project-detail')
	}

	const handleViewProjects = () => {
		setCurrentPage('projects')
	}

	const handleBackFromProjectDetail = () => {
		setCurrentPage('projects')
		setSelectedProject(null)
	}

	const handleThemeChange = (newTheme: 'light' | 'dark') => {
		setTheme(newTheme)
		// Apply theme to both html and body elements
		if (newTheme === 'dark') {
			document.documentElement.classList.add('dark')
			document.body.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
			document.body.classList.remove('dark')
		}
	}

	// Initialize theme on mount
	useEffect(() => {
		// Only access localStorage on client-side
		if (typeof window !== 'undefined') {
			// Check for saved theme preference or default to light
			const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
			const initialTheme = savedTheme || 'light'
			setTheme(initialTheme)
			// Apply initial theme to both html and body
			if (initialTheme === 'dark') {
				document.documentElement.classList.add('dark')
				document.body.classList.add('dark')
			} else {
				document.documentElement.classList.remove('dark')
				document.body.classList.remove('dark')
			}
		}
	}, [])

	// Save theme preference
	useEffect(() => {
		localStorage.setItem('theme', theme)
	}, [theme])

	// Scroll to top when page changes
	useEffect(() => {
		// Only scroll if component is mounted (client-side only)
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'auto' })
		}
	}, [currentPage])

	// Initialize history management on mount
	useEffect(() => {
		if (typeof window === 'undefined') return

		// Prevent automatic scroll restoration by browser
		if (window.history.scrollRestoration) {
			window.history.scrollRestoration = 'manual'
		}

		// Store Next.js's initial state to preserve it
		const nextJsState = window.history.state || {}
		
		// Create a barrier entry to prevent going back past the app
		const barrierState = { 
			...nextJsState, // Preserve Next.js state
			page: 'home', 
			project: null,
			isAppEntry: true,
			isBarrier: true
		}
		
		// Replace the current entry with our barrier
		window.history.replaceState(barrierState, '', window.location.pathname)
		
		// Push the initial state on top of the barrier
		// This creates: [barrier] -> [current state]
		const initialState = { 
			...nextJsState, // Preserve Next.js state
			page: currentPage, 
			project: selectedProject,
			isAppEntry: true,
			isInitial: true
		}
		window.history.pushState(initialState, '', window.location.pathname)

		// Handle browser back/forward buttons
		// Use capture phase to handle event before Next.js
		const handlePopState = (event: PopStateEvent) => {
			const state = event.state
			
			if (state && state.isAppEntry) {
				// Prevent Next.js from handling this event
				event.stopImmediatePropagation?.()
				
				// Check if we hit the barrier
				if (state.isBarrier) {
					// User is trying to go back past our initial entry
					// Push forward to keep them in the app at home
					const homeState = { 
						...state, // Preserve all existing state including Next.js internals
						page: 'home', 
						project: null,
						isAppEntry: true,
						isBarrier: false // Remove barrier flag for new entry
					}
					window.history.pushState(homeState, '', window.location.pathname)
					setIsNavigatingFromHistory(true)
					setCurrentPage('home')
					setSelectedProject(null)
				} else {
					// Normal navigation within the app - restore the state
					setIsNavigatingFromHistory(true)
					setCurrentPage(state.page || 'home')
					setSelectedProject(state.project || null)
				}
			} else {
				// State is null or not from our app (shouldn't happen but just in case)
				const homeState = { 
					...nextJsState,
					page: 'home', 
					project: null,
					isAppEntry: true
				}
				window.history.pushState(homeState, '', window.location.pathname)
				setIsNavigatingFromHistory(true)
				setCurrentPage('home')
				setSelectedProject(null)
			}
		}

		// Use capture phase to intercept before Next.js
		window.addEventListener('popstate', handlePopState, true)

		return () => {
			window.removeEventListener('popstate', handlePopState, true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Push state when page changes (only for user-initiated navigation)
	useEffect(() => {
		if (typeof window === 'undefined') return

		// Skip if this navigation came from history (back/forward button)
		if (isNavigatingFromHistory) {
			setIsNavigatingFromHistory(false)
			return
		}

		// Get current state to preserve Next.js internals
		const currentState = window.history.state || {}

		// Push new state for user-initiated navigation
		const state = { 
			...currentState, // Preserve Next.js state
			page: currentPage, 
			project: selectedProject,
			isAppEntry: true 
		}
		window.history.pushState(state, '', window.location.pathname)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, selectedProject])

	return (
		<>
			<TopNav
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				user={user}
				onAuthClick={handleAuthClick}
				theme={theme}
				onBackFromProjectDetail={handleBackFromProjectDetail}
			/>
			<main className="min-h-screen bg-background pt-20">
				{currentPage === 'home' && (
					<HomePage 
						onViewProjects={handleViewProjects}
						onProjectClick={handleProjectClick}
					/>
				)}
				{currentPage === 'projects' && (
					<ProjectsPage onProjectClick={handleProjectClick} />
				)}
				{currentPage === 'project-detail' && selectedProject && (
					<ProjectDetailPage 
						project={selectedProject}
						onBack={handleBackFromProjectDetail}
					/>
				)}
				{currentPage === 'account' && (
					<AccountPage
						user={user}
						onLogout={handleLogout}
						onPasswordChange={handlePasswordChange}
						onEmailChange={handleEmailChange}
						onAccountDelete={handleAccountDelete}
					/>
				)}
			</main>
			<ThemeToggle theme={theme} onThemeChange={handleThemeChange} />
			<ScrollToTopButton />
			<AuthDialog
				isOpen={isAuthDialogOpen}
				onClose={() => setIsAuthDialogOpen(false)}
				onAuthSuccess={handleAuthSuccess}
			/>
		</>
	)
}
