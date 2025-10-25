module.exports = {
	apps: [{
		name: 'euem-portfolio',
		script: 'npm',
		args: 'start',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '1G',
		env: {
			NODE_ENV: 'production',
			PORT: process.env.PORT || 3000
		},
		error_file: './logs/err.log',
		out_file: './logs/out.log',
		log_file: './logs/combined.log',
		time: true,
		// Health check endpoint
		health_check: {
			url: 'http://localhost:' + (process.env.PORT || 3000) + '/api/health',
			interval: 30000
		}
	}]
}
