const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");

module.exports = {
  name: "DoctorService",
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
    addDoctor: {
      params: {
        "name": "string",
        "data": "object",
      },
      handler(ctx) {
        console.log('DoctorService.addDoctor was called');

        return 'DoctorService.addDoctor was called';
      }
    },
    assign: {
      params: {
        "patientId": "number",
        "doctorId": "number",
      },
      handler(ctx) {
        console.log('DoctorService.assign was called');

        return 'DoctorService.assign was called';
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
  