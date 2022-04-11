const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");

module.exports = {
  name: "PatientService",
  //version: 1,
  //requestTimeout: 3000,

  mixins: [DbService],
  settings: {
    //port: 8080,
  },

  metadata: {

  },

  adapter: new SqlAdapter(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres', //'mysql'|'sqlite'|'postgres'|'mssql'

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },

    noSync: true // If true, the model will not be synced by Sequelize
  }),
  model: {
    /* name: "patients",
    define: {
      id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      //name: Sequelize.STRING,
      //surname: Sequelize.STRING,
      age: Sequelize.INTEGER,
      //status: Sequelize.BOOLEAN
    },
    options: {
      // Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
    } */
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
  },

  actions: {
    addPatient: {
      params: {
        "name": "string",
        "data": "object",
      },
      handler(ctx) {
        console.log('PatientService.addPatient was called');
        await ctx.call("SensorService.addSensorToUser", {}, { meta: {

        }});
        return 'PatientService.addPatient was called';
      }
    },
    getPatient: {
      params: {
        "id": "number",
      },
      handler(ctx) {
        console.log('PatientService.getPatient was called');
        await ctx.call("SensorService.getSensorData", {}, { meta: {

        }});
        return 'PatientService.getPatient was called';
      }
    },
    deletePatient: {
      params: {
        "id": "number",
      },
      handler(ctx) {
        console.log('PatientService.deletePatient was called');

        return 'PatientService.deletePatient was called';
      }
    },
  },

  methods: {
    // Subscribe to event

  },

  events: {
    "sensor.drasticChange"(ctx) {
      console.log('Event sensor.drasticChange was triggered on PatientService service');
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
  