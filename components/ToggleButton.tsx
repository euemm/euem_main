'use client'

import { ArrowUp } from 'lucide-react'

type ScrollToTopButtonProps = {
	className?: string
}

export function ScrollToTopButton({ className = '' }: ScrollToTopButtonProps) {
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}

	return (
		<div className={`fixed bottom-6 left-6 z-50 ${className}`}>
			<button
				onClick={scrollToTop}
				className="p-3 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-200 ios-button group"
				aria-label="Scroll to top"
			>
				<ArrowUp className="w-6 h-6 text-foreground transition-all duration-200 group-hover:scale-110" />
			</button>
		</div>
	)
}
