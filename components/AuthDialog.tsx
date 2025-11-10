'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react'
import { login, registerUser, verifyEmail, resendVerificationCode, type AuthResponse } from '../lib/auth-api'

type AuthMode = 'signin' | 'register' | 'verify'

type AuthDialogProps = {
	isOpen: boolean
	onClose: () => void
	onAuthSuccess: (session: AuthResponse) => void
}

type PendingCredentials = {
	email: string
	password: string
	firstName?: string
	lastName?: string
}

const initialFormState = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
}

export function AuthDialog({ isOpen, onClose, onAuthSuccess }: AuthDialogProps) {
	const [mode, setMode] = useState<AuthMode>('signin')
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState(() => ({ ...initialFormState }))
	const [isLoading, setIsLoading] = useState(false)
	const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''))
	const [isResending, setIsResending] = useState(false)
	const [timeLeft, setTimeLeft] = useState(60)
	const [isVerified, setIsVerified] = useState(false)
	const [error, setError] = useState('')
	const [pendingCredentials, setPendingCredentials] = useState<PendingCredentials | null>(null)
	const verificationEmail = useMemo(() => pendingCredentials?.email || formData.email, [pendingCredentials?.email, formData.email])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	useEffect(() => {
		if (mode === 'verify' && timeLeft > 0 && !isVerified) {
			const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [mode, timeLeft, isVerified])

	useEffect(() => {
		if (mode !== 'verify') {
			setVerificationCode(Array(6).fill(''))
			setError('')
			setIsVerified(false)
			setTimeLeft(60)
			setIsResending(false)
		}
	}, [mode])

	const handleVerificationCodeChange = (index: number, value: string) => {
		if (value.length > 1 || !/^\d*$/.test(value)) return

		const newCode = [...verificationCode]
		newCode[index] = value
		setVerificationCode(newCode)
		setError('')

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

	const resetForm = () => {
		setFormData({ ...initialFormState })
		setVerificationCode(Array(6).fill(''))
		setError('')
		setIsVerified(false)
		setTimeLeft(60)
		setPendingCredentials(null)
		setIsLoading(false)
	}

	const closeAndReset = () => {
		resetForm()
		setMode('signin')
		onClose()
	}

	const handleSignIn = async () => {
		try {
			const { email, password } = formData
			const trimmedEmail = email.trim()
			if (!trimmedEmail || !password) {
				throw new Error('Please enter your email and password.')
			}
			const session = await login(trimmedEmail, password)
			onAuthSuccess(session)
			closeAndReset()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleRegister = async () => {
		try {
			const { name, email, password, confirmPassword } = formData
			const trimmedEmail = email.trim()
			if (!name.trim()) {
				throw new Error('Please provide your full name.')
			}
			if (!trimmedEmail || !password) {
				throw new Error('Email and password are required.')
			}
			if (password !== confirmPassword) {
				throw new Error('Passwords do not match.')
			}
			const trimmedName = name.trim()
			const [firstNamePart, ...rest] = trimmedName.split(' ')
			const firstName = firstNamePart ?? trimmedName
			const lastName = rest.join(' ')
			await registerUser({
				email: trimmedEmail,
				password,
				firstName,
				lastName,
			})
			setPendingCredentials({
				email: trimmedEmail,
				password,
				firstName,
				lastName,
			})
			setMode('verify')
			setTimeLeft(60)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unable to sign up. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleVerification = async () => {
		try {
			const code = verificationCode.join('')
			if (code.length !== 6) {
				throw new Error('Please enter the 6-digit code from your email.')
			}
			await verifyEmail(code)
			setIsVerified(true)
			if (pendingCredentials) {
				try {
					const session = await login(pendingCredentials.email, pendingCredentials.password)
					onAuthSuccess(session)
					setTimeout(() => {
						closeAndReset()
					}, 800)
				} catch (loginError) {
					setError(loginError instanceof Error ? loginError.message : 'Verification succeeded, but automatic sign-in failed. Please try signing in manually.')
					setMode('signin')
				}
			} else {
				setTimeout(() => {
					setMode('signin')
				}, 1200)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Invalid verification code. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

		if (mode === 'signin') {
			await handleSignIn()
			return
		}

		if (mode === 'register') {
			await handleRegister()
			return
		}

		await handleVerification()
	}

	const switchMode = () => {
		if (mode === 'verify') {
			setMode('register')
			setPendingCredentials(null)
			return
		}
		setMode(mode === 'signin' ? 'register' : 'signin')
		setError('')
		setFormData({ ...initialFormState })
		setShowPassword(false)
		setPendingCredentials(null)
	}

	const handleResendCode = async () => {
		if (!verificationEmail) {
			setError('Enter your email before requesting a new code.')
			return
		}
		setIsResending(true)
		setError('')
		try {
			await resendVerificationCode(verificationEmail.trim())
			setTimeLeft(60)
			setVerificationCode(Array(6).fill(''))
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to resend code. Please try again.')
		} finally {
			setIsResending(false)
		}
	}

	const handleBackToSignUp = () => {
		setMode('register')
		setIsVerified(false)
		setError('')
		setVerificationCode(Array(6).fill(''))
		setTimeLeft(60)
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
						onClick={closeAndReset}
						className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
					>
						<X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 sm:p-6">
					{mode === 'verify' ? (
						<div className="space-y-6">
							{isVerified ? (
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
								<div className="space-y-6">
									<div className="text-center">
										<div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
											<Mail className="h-6 w-6 text-euem-blue-600 dark:text-euem-blue-400" />
										</div>
										<p className="text-sm text-muted-foreground mb-2">
											We sent a 6-digit verification code to:
										</p>
										<p className="font-medium text-foreground">
											{verificationEmail}
										</p>
									</div>

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

									<div className="text-center">
										<p className="text-xs text-muted-foreground">
											Check your spam folder if you don&apos;t see the email.
										</p>
									</div>
								</div>
							)}
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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

							{error && (
								<p className="text-xs sm:text-sm text-red-500 text-center">
									{error}
								</p>
							)}

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