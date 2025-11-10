'use client'

import { X, ShieldAlert } from 'lucide-react'

type AffiliationNoticeProps = {
	isOpen: boolean
	projectName?: string
	onClose: () => void
	onAuthRequest: () => void
	onVisitAnyway?: () => void
}

export function AffiliationNotice({
	isOpen,
	projectName,
	onClose,
	onAuthRequest,
	onVisitAnyway,
}: AffiliationNoticeProps) {
	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center p-2 sm:p-4 sm:items-center">
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="relative w-full max-w-md bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl">
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
							<ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5" />
						</div>
						<div>
							<h2 className="text-lg sm:text-xl font-semibold text-foreground">
								Sign In Required
							</h2>
							<p className="text-xs sm:text-sm text-muted-foreground">
								This project uses shared EUEM credentials.
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors"
					>
						<X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
					</button>
				</div>
				<div className="p-4 sm:p-6 space-y-4">
					<p className="text-sm sm:text-base text-muted-foreground">
						{projectName
							? `${projectName} requires you to register or sign in with your EUEM account to use features from the site.`
							: 'This project requires you to register or sign in with your EUEM account to use features from the site.'}
					</p>
					<div className="flex flex-col sm:flex-row sm:justify-end gap-2">
						<button
							type="button"
							onClick={() => {
								onVisitAnyway?.()
								onClose()
							}}
							className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border border-border text-sm sm:text-base text-foreground hover:bg-muted transition-colors"
						>
							Visit Anyway
						</button>
						<button
							type="button"
							onClick={onAuthRequest}
							className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-euem-blue-600 hover:bg-euem-blue-700 text-white text-sm sm:text-base font-medium transition-colors"
						>
							Register or Sign In
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

