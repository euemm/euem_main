'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
	Home,
	FolderOpen,
	UserCircle,
	LogIn,
	ChevronLeft,
} from 'lucide-react'

type Page = 'home' | 'projects' | 'account' | 'project-detail' | 'skill-detail'

type TopNavProps = {
	currentPage?: Page
	setCurrentPage?: (page: Page) => void
	user?: any
	onAuthClick?: () => void
	onBackFromProjectDetail?: () => void
	onBackFromSkillDetail?: () => void
	theme?: 'light' | 'dark'
}

export function TopNav({
	currentPage = 'home',
	setCurrentPage = () => {},
	user = null,
	onAuthClick = () => {},
	onBackFromProjectDetail,
	onBackFromSkillDetail,
	theme = 'light',
}: TopNavProps) {
	const navItems = [
		{ id: 'home' as Page, label: 'Home', icon: Home },
		{
			id: 'projects' as Page,
			label: 'Projects',
			icon: FolderOpen,
		},
		{
			id: 'account' as Page,
			label: 'Account',
			icon: UserCircle,
		},
	]

	const isProjectDetail = currentPage === 'project-detail'
	const isSkillDetail = currentPage === 'skill-detail'
	const isDetailPage = isProjectDetail || isSkillDetail

	return (
		<div className="fixed top-0 left-0 right-0 z-50 safe-area-top flex justify-center">
			<div className="w-full max-w-2xl px-2 sm:px-4 pt-2">
				<div className="mx-1 sm:mx-2 mt-2 rounded-[20px] bg-card border border-border shadow-sm">
					<div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
						{/* Logo/Brand or Back Button */}
						{isDetailPage ? (
							<button
								onClick={
									isProjectDetail
										? onBackFromProjectDetail
										: onBackFromSkillDetail
								}
								className="flex items-center gap-1 text-primary ios-button p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 transition-all"
							>
								<ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
								<span className="text-sm sm:text-base">
									{isProjectDetail ? 'Projects' : 'Home'}
								</span>
							</button>
						) : (
							<button
								onClick={() => setCurrentPage('home')}
								className="flex items-center gap-1.5 sm:gap-2 ios-button hover:opacity-80 transition-opacity"
							>
								<Image
									src="/EUEM_LIGHT.png"
									alt="EUEM Logo"
									width={32}
									height={32}
									className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg object-contain"
								/>
								<span className="text-sm sm:text-base text-foreground">Portfolio</span>
							</button>
						)}

						{/* Navigation */}
						{!isDetailPage && (
							<div className="flex items-center gap-0.5 sm:gap-1">
								{navItems.map((item) => {
									const Icon = item.icon
									const isActive = currentPage === item.id
									const isAccountWithoutUser =
										item.id === 'account' && !user

									return (
										<button
											key={item.id}
											onClick={() => setCurrentPage(item.id)}
											disabled={isAccountWithoutUser}
											className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all ios-button ${
												isActive
													? 'text-primary bg-primary/10'
													: isAccountWithoutUser
														? 'text-muted-foreground/50 cursor-not-allowed'
														: 'text-muted-foreground hover:text-foreground'
											}`}
										>
											<Icon className="h-4 w-4 sm:h-5 sm:w-5" />
											<span className="hidden sm:inline text-sm">
												{item.label}
											</span>
										</button>
									)
								})}

								{/* Auth Button */}
								{!user && (
									<button
										onClick={onAuthClick}
										className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground ios-button ml-1 sm:ml-2"
									>
										<LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
										<span className="hidden sm:inline text-sm">Sign In</span>
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}