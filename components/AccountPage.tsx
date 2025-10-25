'use client'

import { useState } from 'react'
import { User, Mail, Lock, Settings, LogOut, Trash2, ChevronRight, Shield, AlertTriangle } from 'lucide-react'

type AccountPageProps = {
	user: { name: string; email: string; id: string } | null
	onLogout: () => void
	onPasswordChange?: () => void
	onEmailChange?: () => void
	onAccountDelete?: () => void
}

export function AccountPage({ 
	user, 
	onLogout, 
	onPasswordChange, 
	onEmailChange, 
	onAccountDelete 
}: AccountPageProps) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	if (!user) {
		return (
			<div className="min-h-screen bg-background pt-16 sm:pt-20 pb-16 sm:pb-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="max-w-2xl mx-auto text-center">
						<div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
							<User className="h-8 w-8 text-muted-foreground" />
						</div>
						<h1 className="text-2xl font-bold text-foreground mb-2">Account Required</h1>
						<p className="text-muted-foreground">
							Please sign in to access your account settings.
						</p>
					</div>
				</div>
			</div>
		)
	}

	const handleDeleteAccount = () => {
		onAccountDelete?.()
		setShowDeleteConfirm(false)
	}

	return (
		<div className="min-h-screen bg-background pt-16 sm:pt-20 pb-16 sm:pb-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Header */}
				<div className="max-w-2xl mx-auto mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Account Settings</h1>
					<p className="text-muted-foreground">
						Manage your account information and preferences
					</p>
				</div>

				{/* Account Info Card */}
				<div className="max-w-2xl mx-auto mb-8">
					<div className="bg-card border border-border rounded-xl p-6">
						<div className="flex items-center gap-4 mb-6">
							<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
								<User className="h-8 w-8 text-euem-blue-600 dark:text-euem-blue-400" />
							</div>
							<div>
								<h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
								<p className="text-muted-foreground">{user.email}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Settings Sections */}
				<div className="max-w-2xl mx-auto space-y-6">
					{/* Security Settings */}
					<div className="bg-card border border-border rounded-xl overflow-hidden">
						<div className="p-4 border-b border-border">
							<div className="flex items-center gap-3">
								<Shield className="h-5 w-5 text-euem-blue-600" />
								<h3 className="text-lg font-semibold text-foreground">Security</h3>
							</div>
						</div>
						<div className="divide-y divide-border">
							<button
								onClick={onPasswordChange}
								className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors ios-button"
							>
								<div className="flex items-center gap-3">
									<Lock className="h-5 w-5 text-muted-foreground" />
									<div className="text-left">
										<p className="font-medium text-foreground">Change Password</p>
										<p className="text-sm text-muted-foreground">Update your account password</p>
									</div>
								</div>
								<ChevronRight className="h-5 w-5 text-muted-foreground" />
							</button>
							
							<button
								onClick={onEmailChange}
								className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors ios-button"
							>
								<div className="flex items-center gap-3">
									<Mail className="h-5 w-5 text-muted-foreground" />
									<div className="text-left">
										<p className="font-medium text-foreground">Change Email</p>
										<p className="text-sm text-muted-foreground">Update your email address</p>
									</div>
								</div>
								<ChevronRight className="h-5 w-5 text-muted-foreground" />
							</button>
						</div>
					</div>

					{/* Account Management */}
					<div className="bg-card border border-border rounded-xl overflow-hidden">
						<div className="p-4 border-b border-border">
							<div className="flex items-center gap-3">
								<Settings className="h-5 w-5 text-euem-blue-600" />
								<h3 className="text-lg font-semibold text-foreground">Account Management</h3>
							</div>
						</div>
						<div className="divide-y divide-border">
							<button
								onClick={() => setShowDeleteConfirm(true)}
								className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ios-button text-red-600 dark:text-red-400"
							>
								<div className="flex items-center gap-3">
									<Trash2 className="h-5 w-5" />
									<div className="text-left">
										<p className="font-medium">Remove Account</p>
										<p className="text-sm text-muted-foreground">Permanently delete your account</p>
									</div>
								</div>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>
					</div>

					{/* Logout */}
					<div className="bg-card border border-border rounded-xl overflow-hidden">
						<button
							onClick={onLogout}
							className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors ios-button"
						>
							<div className="flex items-center gap-3">
								<LogOut className="h-5 w-5 text-muted-foreground" />
								<div className="text-left">
									<p className="font-medium text-foreground">Sign Out</p>
									<p className="text-sm text-muted-foreground">Sign out of your account</p>
								</div>
							</div>
							<ChevronRight className="h-5 w-5 text-muted-foreground" />
						</button>
					</div>
				</div>

				{/* Delete Account Confirmation Modal */}
				{showDeleteConfirm && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
						<div className="relative bg-card border border-border rounded-xl p-6 max-w-md w-full">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
									<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-foreground">Delete Account</h3>
									<p className="text-sm text-muted-foreground">This action cannot be undone</p>
								</div>
							</div>
							<p className="text-sm text-muted-foreground mb-6">
								Are you sure you want to permanently delete your account? This will remove all your data and cannot be reversed.
							</p>
							<div className="flex gap-3">
								<button
									onClick={() => setShowDeleteConfirm(false)}
									className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={handleDeleteAccount}
									className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
								>
									Delete Account
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}