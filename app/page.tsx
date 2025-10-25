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
	}, [])

	// Save theme preference
	useEffect(() => {
		localStorage.setItem('theme', theme)
	}, [theme])

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
						onViewProjects={() => setCurrentPage('projects')}
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
