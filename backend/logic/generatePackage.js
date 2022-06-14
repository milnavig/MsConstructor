
module.exports = function generatePackage(options) {
  const package = 
`{
  "name": "molecular",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "moleculer-runner --repl --hot services/**/*.service.js",
    "start": "moleculer-runner",
    "cli": "moleculer connect NATS",
    "ci": "jest --watch",
    "test": "jest --coverage",
    "dc:up": "docker-compose up --build -d",
    "dc:logs": "docker-compose logs -f",
    "dc:down": "docker-compose down"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.0.0",
    "moleculer": "^0.14.19",
    "moleculer-db": "^0.8.17",
    "moleculer-repl": "^0.7.0",
    "moleculer-db-adapter-sequelize": "^0.2.13",
    "moleculer-web": "^0.10.4",
    "nats": "^2.6.0",
    ${options.serviceDiscovery.discoverer === "Redis" ? `"ioredis": "^5.0.6",` : options.serviceDiscovery.discoverer === "etcd3" ? `"etcd3": "^1.1.0",` : ``}
    ${options.broker.transporter === "Redis" ? `"ioredis": "^5.0.6",` : 
    options.broker.transporter === "NATS" ? `"nats": "^2.7.1",` : 
    options.broker.transporter === "MQTT" ? `"mqtt": "^4.3.7",` : 
    options.broker.transporter === "AMQP (0.9)" || options.broker.transporter === "AMQP (1.0)" ? `"amqplib": "^0.10.0",
    "rhea-promise": "^2.1.0",` : 
    options.broker.transporter === "Kafka" ? `"kafka-node": "^5.0.0",` : 
    options.broker.transporter === "NATS Streaming (STAN)" ? `"node-nats-streaming": "^0.3.2",` : ""}
    ${options.broker.serializer === "Avro" ? `"avsc": "^5.7.4",` :
    options.broker.serializer === "MsgPack" ? `"msgpack5": "^6.0.0",` :
    options.broker.serializer === "ProtoBuf" ? `"protobufjs": "^6.11.3",` :
    options.broker.serializer === "Notepack" ? `"notepack.io": "^3.0.1",` :
    options.broker.serializer === "Thrift" ? `"thrift": "^0.16.0",` : ""}
    ${options.logger.logger === "Winston" ? `"winston": "^3.7.2",` :
    options.logger.logger === "Pino" ? `"pino": "^8.0.0",` :
    options.logger.logger === "Bunyan" ? `"bunyan": "^1.8.15",` : ""}
    "pg": "^8.7.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.15.1"
  }
}
`;
  return package;
}
