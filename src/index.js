const Server = require('./Server.js')

class ServerlessLocalDevServerPlugin {
	constructor(serverless, options) {
		this.serverless = serverless
		this.options = options || {}

		this.commands = {
			'local-dev-server': {
				usage:
					'Runs a local dev server for Alexa-Skill and HTTP functions',
				lifecycleEvents: ['loadEnvVars', 'start'],
				options: {
					port: { usage: 'Port to listen on', shortcut: 'p' }
				}
			}
		}

		this.hooks = {
			'local-dev-server:loadEnvVars': this.loadEnvVars.bind(this),
			'local-dev-server:start': this.start.bind(this)
		}
	}

	loadEnvVars() {
		Object.assign(process.env, { IS_LOCAL: true })
	}

	start() {
		let server = new Server()
		server.log = this.serverless.cli.log.bind(this.serverless.cli)
		Object.assign(server.customEnvironment, this.options.environment)
		server.setConfiguration(
			this.serverless.service,
			this.serverless.config.servicePath
		)
		server.start(this.options.port || 5005)
	}
}

module.exports = ServerlessLocalDevServerPlugin
