// EUEM Logo Color Palette
// Extracted from EUEM_LIGHT.png and EUEM_DARK.png

export const euemColors = {
	// Primary brand colors from logo
	purple: {
		50: '#F3F0FF',
		100: '#E9E3FF',
		200: '#D6C7FF',
		300: '#B8A0FF',
		400: '#9B7AFF',
		500: '#7C3AED', // Main purple
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
	// Background colors
	background: {
		light: '#F4F7F5', // Logo light background
		dark: '#190933', // Logo dark background
	},
	// Neutral grays
	neutral: {
		50: '#F9FAFB',
		100: '#F3F4F6',
		200: '#E5E7EB',
		300: '#D1D5DB',
		400: '#9CA3AF',
		500: '#6B7280',
		600: '#4B5563',
		700: '#374151',
		800: '#1F2937',
		900: '#111827',
	},
} as const

// CSS Custom Properties for Tailwind
export const cssVariables = {
	'--euem-purple': euemColors.purple[900],
	'--euem-red': euemColors.red[500],
	'--euem-blue': euemColors.blue[500],
	'--euem-cyan': euemColors.cyan[500],
	'--euem-bg-light': euemColors.background.light,
	'--euem-bg-dark': euemColors.background.dark,
} as const
