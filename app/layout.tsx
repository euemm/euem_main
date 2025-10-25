import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'EUEM',
	icons: {
		icon: [
			{ url: '/img/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/img/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: [
			{ url: '/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
		],
		shortcut: '/img/favicon.ico',
	},
	manifest: '/img/site.webmanifest'
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
