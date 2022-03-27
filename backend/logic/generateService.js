module.exports = function generateService(msName, actions, methods, meta, events) {
  const version = 1;
  const fileData = 
`module.exports = {
  name: ${msName},
  version: ${version},
  //requestTimeout: 3000,

  settings: {
    
  },

  metadata: {
${
meta.map(m => 
`    "${m.name}": "${m.value}",`).join('\n')
}
  },

  actions: {
${
  actions.map(action =>
`    ${action.name}: {
      params: {
${action.parameters.map(parameter => 
`        "${parameter.name}": "${parameter.type}",`).join('\n')}
      },
      handler(ctx) {
${
          action.calls.map(c => c.type === 'balanced_event' ?
`        await ctx.call("${c.microservice}.${c.action}", {}, { meta: {
        }});` 
            :
`        await ctx.broadcast("${c.microservice}.${c.action}", {}, { meta: {
        }});`)
}
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
      handler(ctx) {
        //
      }
    },
      `).join('\n')
    }
  },

  events: {
${
    events.map(event => 
`    "${event.name}"(ctx) {
        //
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
