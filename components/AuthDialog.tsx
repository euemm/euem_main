'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react'

type AuthMode = 'signin' | 'register' | 'verify'

type AuthDialogProps = {
	isOpen: boolean
	onClose: () => void
	onAuthSuccess: (user: any) => void
}

export function AuthDialog({ isOpen, onClose, onAuthSuccess }: AuthDialogProps) {
	const [mode, setMode] = useState<AuthMode>('signin')
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	})
	const [isLoading, setIsLoading] = useState(false)
	const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''))
	const [isResending, setIsResending] = useState(false)
	const [timeLeft, setTimeLeft] = useState(60)
	const [isVerified, setIsVerified] = useState(false)
	const [error, setError] = useState('')
	const [pendingUser, setPendingUser] = useState<any>(null)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	// Countdown timer effect
	useEffect(() => {
		if (mode === 'verify' && timeLeft > 0 && !isVerified) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [mode, timeLeft, isVerified])

	// Reset verification state when switching modes
	useEffect(() => {
		if (mode !== 'verify') {
			setVerificationCode(Array(6).fill(''))
			setError('')
			setIsVerified(false)
			setTimeLeft(60)
		}
	}, [mode])

	const handleVerificationCodeChange = (index: number, value: string) => {
		if (value.length > 1 || !/^\d*$/.test(value)) return

		const newCode = [...verificationCode]
		newCode[index] = value
		setVerificationCode(newCode)
		setError('')

		// Auto-focus next input
		if (value && index < 5) {
			const nextInput = document.getElementById(`code-${index + 1}`)
			nextInput?.focus()
		}
	}

	const handleVerificationKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
			const prevInput = document.getElementById(`code-${index - 1}`)
			prevInput?.focus()
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		if (mode === 'verify') {
			// Handle verification submission
			const code = verificationCode.join('')
			if (code.length !== 6) {
				setError('Please enter a valid 6-digit code')
				setIsLoading(false)
				return
			}

			// Simulate API call for verification
			setTimeout(() => {
				if (code === '123456') {
					setIsVerified(true)
					setTimeout(() => {
						onAuthSuccess(pendingUser)
						onClose()
						resetForm()
					}, 2000)
				} else {
					setError('Invalid verification code. Please try again.')
				}
				setIsLoading(false)
			}, 1500)
			return
		}

		// Handle sign in / sign up
		// Simulate API call
		setTimeout(() => {
			const user = {
				name: formData.name || 'Demo User',
				email: formData.email,
				id: Math.random().toString(36).substr(2, 9)
			}

			if (mode === 'signin') {
				// Direct login for sign in
				onAuthSuccess(user)
				setIsLoading(false)
				onClose()
				resetForm()
			} else {
				// Show email verification for registration
				setPendingUser(user)
				setMode('verify')
				setIsLoading(false)
			}
		}, 1000)
	}

	const resetForm = () => {
		setFormData({ name: '', email: '', password: '', confirmPassword: '' })
		setVerificationCode(Array(6).fill(''))
		setError('')
		setIsVerified(false)
		setTimeLeft(60)
		setPendingUser(null)
		setIsLoading(false)
	}

	const switchMode = () => {
		setMode(mode === 'signin' ? 'register' : 'signin')
		resetForm()
	}

	const handleResendCode = async () => {
		setIsResending(true)
		setError('')

		// Simulate API call
		setTimeout(() => {
			setTimeLeft(60)
			setVerificationCode(Array(6).fill(''))
			setIsResending(false)
		}, 1000)
	}

	const handleBackToSignUp = () => {
		setMode('register')
		resetForm()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center p-2 sm:p-4 sm:items-center">
			{/* Backdrop */}
			<div 
				className="fixed inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			
			{/* Dialog */}
			<div className="relative w-full max-w-md bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
					<div className="flex items-center gap-3 flex-1">
						{mode === 'verify' && (
							<button
								onClick={handleBackToSignUp}
								className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
							>
								<ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
							</button>
						)}
						<div className="flex-1">
							<h2 className="text-xl sm:text-2xl font-bold text-foreground">
								{mode === 'signin' ? 'Welcome Back' :
								 mode === 'register' ? 'Create Account' :
								 isVerified ? 'Email Verified!' : 'Verify Your Email'}
							</h2>
							<p className="text-muted-foreground text-xs sm:text-sm">
								{mode === 'signin'
									? 'Sign in to your account to continue'
									: mode === 'register'
									? 'Sign up to get started with your portfolio'
									: isVerified
									? 'Your email has been successfully verified'
									: 'We sent a verification code to your email'
								}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
					>
						<X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 sm:p-6">
					{mode === 'verify' ? (
						/* Verification Form */
						<div className="space-y-6">
							{isVerified ? (
								/* Success State */
								<div className="text-center space-y-4">
									<div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
										<CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
									</div>
									<div>
										<h3 className="text-lg font-semibold text-foreground mb-2">
											Welcome to your portfolio!
										</h3>
										<p className="text-sm text-muted-foreground">
											Your account has been created and verified successfully.
										</p>
									</div>
								</div>
							) : (
								/* Verification Code Input */
								<div className="space-y-6">
									{/* Email Display */}
									<div className="text-center">
										<div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
											<Mail className="h-6 w-6 text-euem-blue-600 dark:text-euem-blue-400" />
										</div>
										<p className="text-sm text-muted-foreground mb-2">
											We sent a 6-digit verification code to:
										</p>
										<p className="font-medium text-foreground">
											{formData.email}
										</p>
									</div>

									{/* 6-digit code inputs */}
									<form onSubmit={handleSubmit} className="space-y-4">
										<div className="space-y-2">
											<label className="text-xs sm:text-sm font-medium text-foreground text-center block">
												Enter Verification Code
											</label>
											<div className="flex gap-2 sm:gap-3 justify-center">
												{verificationCode.map((digit, index) => (
													<input
														key={index}
														id={`code-${index}`}
														type="text"
														value={digit}
														onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
														onKeyDown={(e) => handleVerificationKeyDown(index, e)}
														className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-mono bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-euem-blue-500 focus:border-transparent"
														maxLength={1}
														required
													/>
												))}
											</div>
											{error && (
												<p className="text-xs text-red-500 text-center">{error}</p>
											)}
										</div>

										{/* Submit Button */}
										<button
											type="submit"
											disabled={isLoading || verificationCode.join('').length !== 6}
											className="w-full py-2.5 sm:py-3 px-4 bg-euem-blue-600 hover:bg-euem-blue-700 disabled:bg-euem-blue-400 text-white font-medium rounded-lg transition-colors ios-button text-sm sm:text-base"
										>
											{isLoading ? (
												<div className="flex items-center justify-center gap-2">
													<div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
													<span className="text-xs sm:text-sm">Verifying...</span>
												</div>
											) : (
												'Verify Email'
											)}
										</button>
									</form>

									{/* Resend Code */}
									<div className="text-center space-y-3">
										<p className="text-xs sm:text-sm text-muted-foreground">
											Didn&apos;t receive the code?
										</p>

										{timeLeft > 0 ? (
											<p className="text-xs text-muted-foreground">
												Resend code in {timeLeft}s
											</p>
										) : (
											<button
												onClick={handleResendCode}
												disabled={isResending}
												className="inline-flex items-center gap-2 text-euem-blue-600 hover:text-euem-blue-700 dark:text-euem-blue-400 dark:hover:text-euem-blue-300 font-medium text-sm disabled:opacity-50"
											>
												{isResending ? (
													<>
														<RefreshCw className="h-3 w-3 animate-spin" />
														Sending...
													</>
												) : (
													<>
														<RefreshCw className="h-3 w-3" />
														Resend Code
													</>
												)}
											</button>
										)}
									</div>

									{/* Help Text */}
									<div className="text-center">
										<p className="text-xs text-muted-foreground">
											Check your spam folder if you don&apos;t see the email.
										</p>
									</div>
								</div>
							)}
						</div>
					) : (
						/* Auth Form (Sign In / Sign Up) */
						<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
							{/* Name field for registration */}
							{mode === 'register' && (
								<div className="space-y-1.5 sm:space-y-2">
									<label htmlFor="name" className="text-xs sm:text-sm font-medium text-foreground">
										Full Name
									</label>
									<div className="relative">
										<User className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
										<input
											id="name"
											name="name"
											type="text"
											value={formData.name}
											onChange={handleInputChange}
											placeholder="Enter your full name"
											className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-euem-blue-500 focus:border-transparent text-sm sm:text-base"
											required={mode === 'register'}
										/>
									</div>
								</div>
							)}

							{/* Email field */}
							<div className="space-y-1.5 sm:space-y-2">
								<label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground">
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
									<input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleInputChange}
										placeholder="Enter your email"
										className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-euem-blue-500 focus:border-transparent text-sm sm:text-base"
										required
									/>
								</div>
							</div>

							{/* Password field */}
							<div className="space-y-1.5 sm:space-y-2">
								<label htmlFor="password" className="text-xs sm:text-sm font-medium text-foreground">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
									<input
										id="password"
										name="password"
										type={showPassword ? 'text' : 'password'}
										value={formData.password}
										onChange={handleInputChange}
										placeholder="Enter your password"
										className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-euem-blue-500 focus:border-transparent text-sm sm:text-base"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
									>
										{showPassword ? <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
									</button>
								</div>
							</div>

							{/* Confirm Password field for registration */}
							{mode === 'register' && (
								<div className="space-y-1.5 sm:space-y-2">
									<label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium text-foreground">
										Confirm Password
									</label>
									<div className="relative">
										<Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
										<input
											id="confirmPassword"
											name="confirmPassword"
											type={showPassword ? 'text' : 'password'}
											value={formData.confirmPassword}
											onChange={handleInputChange}
											placeholder="Confirm your password"
											className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-euem-blue-500 focus:border-transparent text-sm sm:text-base"
											required={mode === 'register'}
										/>
									</div>
								</div>
							)}

							{/* Forgot password link for sign in */}
							{mode === 'signin' && (
								<div className="text-right">
									<button
										type="button"
										className="text-sm text-euem-blue-600 hover:text-euem-blue-700 dark:text-euem-blue-400 dark:hover:text-euem-blue-300"
									>
										Forgot password?
									</button>
								</div>
							)}

							{/* Submit button */}
							<button
								type="submit"
								disabled={isLoading}
								className="w-full py-2.5 sm:py-3 px-4 bg-euem-blue-600 hover:bg-euem-blue-700 disabled:bg-euem-blue-400 text-white font-medium rounded-lg transition-colors ios-button text-sm sm:text-base"
							>
								{isLoading ? (
									<div className="flex items-center justify-center gap-2">
										<div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										<span className="text-xs sm:text-sm">
											{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
										</span>
									</div>
								) : (
									mode === 'signin' ? 'Sign In' : 'Create Account'
								)}
							</button>

							{/* Mode switch */}
							<div className="text-center">
								<p className="text-xs sm:text-sm text-muted-foreground">
									{mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
									<button
										type="button"
										onClick={switchMode}
										className="text-euem-blue-600 hover:text-euem-blue-700 dark:text-euem-blue-400 dark:hover:text-euem-blue-300 font-medium"
									>
										{mode === 'signin' ? 'Sign up' : 'Sign in'}
									</button>
								</p>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	)
}