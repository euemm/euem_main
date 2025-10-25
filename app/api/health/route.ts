import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
	const healthCheck = {
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: Math.floor(process.uptime()),
		nodeVersion: process.version,
		environment: process.env.NODE_ENV || 'development',
		port: process.env.PORT || 3000
	}

	return NextResponse.json(healthCheck)
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const healthCheck = {
			status: 'ok',
			timestamp: new Date().toISOString(),
			uptime: Math.floor(process.uptime()),
			nodeVersion: process.version,
			environment: process.env.NODE_ENV || 'development',
			port: process.env.PORT || 3000,
			memory: {
				used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
				total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
				external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100
			},
			custom: body.customCheck || null
		}

		return NextResponse.json(healthCheck)
	} catch (error) {
		return NextResponse.json({ status: 'error', error: 'Invalid JSON' }, { status: 400 })
	}
}
