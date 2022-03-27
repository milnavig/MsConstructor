module.exports = {
  name: car,
  version: 1,
  //requestTimeout: 3000,

  settings: {
    
  },

  metadata: {

  },

  actions: {
    add: {
      params: {
        "name": "string",
        "data": "object",
      },
      handler(ctx) {
        await ctx.call("garage.addToGarage", {}, { meta: {
        }});
      }
    },
    list: {
      params: {

      },
      handler(ctx) {

      }
    },
  },

  methods: {
    // Subscribe to event

  },

  events: {

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
  