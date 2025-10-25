/** @type {import('next').NextConfig} */
const nextConfig = {
	// App directory is stable in Next.js 14+
	output: 'standalone',
	basePath: '/main',
	images: {
		unoptimized: true,
		domains: [],
	},
	// Ensure static files are served correctly
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},
}

module.exports = nextConfig
