module.exports = {
  name: garage,
  version: 1,
  //requestTimeout: 3000,

  settings: {
    
  },

  metadata: {

  },

  actions: {
    addToGarage: {
      params: {
        "name": "string",
      },
      handler(ctx) {

      }
    },
  },

  methods: {
    // Subscribe to event
    list2: {
      params: {
        
      },
      handler(ctx) {
        //
      }
    },
      
  },

  events: {
    "car.added"(ctx) {
        //
    },
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
  