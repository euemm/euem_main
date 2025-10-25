import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'EUEM',
	icons: {
		icon: [
			{ url: '/main/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/main/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: [
			{ url: '/main/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
		],
		shortcut: '/main/favicon.ico',
	},
	manifest: '/main/site.webmanifest'
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	)
}
