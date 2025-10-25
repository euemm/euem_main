'use client'

import { Sun, Moon } from 'lucide-react'

type ThemeToggleProps = {
	theme: 'light' | 'dark'
	onThemeChange: (theme: 'light' | 'dark') => void
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
	const toggleTheme = () => {
		onThemeChange(theme === 'light' ? 'dark' : 'light')
	}

	return (
		<button
			onClick={toggleTheme}
			className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-200 ios-button group"
			aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		>
			<div className="relative w-6 h-6">
				<Sun
					className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 ${
						theme === 'light'
							? 'opacity-100 rotate-0 scale-100'
							: 'opacity-0 rotate-90 scale-75'
					}`}
				/>
				<Moon
					className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
						theme === 'dark'
							? 'opacity-100 rotate-0 scale-100'
							: 'opacity-0 -rotate-90 scale-75'
					}`}
				/>
			</div>
		</button>
	)
}