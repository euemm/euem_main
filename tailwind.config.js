/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				// EUEM Brand Colors
				euem: {
					purple: {
						50: '#F3F0FF',
						100: '#E9E3FF',
						200: '#D6C7FF',
						300: '#B8A0FF',
						400: '#9B7AFF',
						500: '#7C3AED',
						600: '#6D28D9',
						700: '#5B21B6',
						800: '#4C1D95',
						900: '#201139', // Logo purple
						950: '#190933', // Dark variant
					},
					red: {
						50: '#FEF2F2',
						100: '#FEE2E2',
						200: '#FECACA',
						300: '#FCA5A5',
						400: '#F87171',
						500: '#FE4B4A', // Logo red
						600: '#DC2626',
						700: '#B91C1C',
						800: '#991B1B',
						900: '#7F1D1D',
					},
					blue: {
						50: '#EFF6FF',
						100: '#DBEAFE',
						200: '#BFDBFE',
						300: '#93C5FD',
						400: '#60A5FA',
						500: '#4666FF', // Logo blue
						600: '#2563EB',
						700: '#1D4ED8',
						800: '#1E40AF',
						900: '#1E3A8A',
					},
					cyan: {
						50: '#ECFEFF',
						100: '#CFFAFE',
						200: '#A5F3FC',
						300: '#67E8F9',
						400: '#22D3EE',
						500: '#12B5F7', // Logo cyan
						600: '#0891B2',
						700: '#0E7490',
						800: '#155E75',
						900: '#164E63',
					},
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
