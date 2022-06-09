module.exports = function generateService(msName, actions, methods, hasDB, dbName, meta, events) {
  const version = 1;
  const fileData = 
`${hasDB ? `const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
require('dotenv').config();
` : ''}
module.exports = {
  name: "${msName}",
  //version: ${version},
  //requestTimeout: 3000,

  ${hasDB ? `mixins: [DbService],` : ''}
  settings: {
    //port: 8080,
  },

  metadata: {
${
meta.map(m => 
`    "${m.name}": "${m.value}",`).join('\n')
}
  },
${hasDB ? `
  adapter: new SqlAdapter(${`"${dbName}"`}, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: ${`"${dbName}"`},
    dialect: 'postgres', //'mysql'|'sqlite'|'postgres'|'mssql'

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },

    noSync: true // If true, the model will not be synced by Sequelize
  }),
  model: {
    
  },

  afterConnected() {
    this.logger.info("Connected successfully");
  },

  entityCreated(json, ctx) {
    this.logger.info("New entity created!");
  },

  entityUpdated(json, ctx) {
    // You can also access to Context
  },

  entityRemoved(json, ctx) {
    this.logger.info("Entity removed", json);
  },` : ''}

  actions: {
${
  actions.map(action =>
`    ${action.name}: {
      params: {
${action.parameters.map(parameter => 
`        "${parameter.name}": "${parameter.type}",`).join('\n')}
      },
      async handler(ctx) {
        console.log('${msName}.${action.name} was called');
${
          action.calls.map(c => 
`        await ctx.call("${c.microservice}.${c.action}", {}, { meta: {

        }});`).join('\n')
}
${
          action.events.map(e => 
`        ctx.emit("${e.event_name}", {});`).join('\n')
}
        return '${msName}.${action.name} was called';
      }
    },`).join('\n')
    }
  },

  methods: {
    // Subscribe to event
${
      methods.map(method => 
`    ${method.name}: {
      params: {
        ${method.parameters.map(parameter => 
`         "${parameter.name}": "${parameter.type}",`).join('\n')}
      },
      async handler(ctx) {
        console.log('${msName}.${method.name} was called');
        return '${msName}.${method.name} was called';
      }
    },
      `).join('\n')
    }
  },

  events: {
${
    events.map(event => 
`    "${event.name}"(ctx) {
      console.log('Event ${event.name} was triggered on ${msName} service');
    },`
    ).join('\n')}
  },

  created() {
    // Fired when the service instance created
  },

  async started() {
    // Fired when broker starts this service
  },

  async stopped() {
    // Fired when broker stops this service
  },
}
  `;

  return fileData;
}
