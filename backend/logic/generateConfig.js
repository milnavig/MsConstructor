module.exports = function generateConfig(options) {
  const namespace = "dev";
  const config = 
`"use strict";

module.exports = {
  namespace: "${namespace}",
  //nodeID: "node-main",

  logger: "${options.logger.logger}",
  logLevel: "${options.logger.logLevel}",
  logFormatter: "${options.logger.formatter}",
  logObjectPrinter: null,

  transporter: "${options.broker.transporter === "Redis" ? "redis://redis-server:6379" : 
  options.broker.transporter === "MQTT" ? "mqtt://mqtt-server:1883" : 
  options.broker.transporter === "AMQP (0.9)" ? "amqp://rabbitmq-server:5672" :
  options.broker.transporter === "AMQP (1.0)" ? "amqp10://admin:admin@activemq-server:5672" : 
  options.broker.transporter === "NATS Streaming (STAN)" ? "stan://nats-streaming-server:4222" : 
  options.broker.transporter === "NATS" ? "nats://nats.server:4222" : 
  options.broker.transporter === "Kafka" ? "kafka://kafka:9092" : options.broker.transporter}",

  requestTimeout: 5000,
  retryPolicy: {
    enabled: ${options.broker.retry.enabled},
    retries: ${options.broker.retry.retries},
    delay: ${options.broker.retry.delay},
    maxDelay: ${options.broker.retry.maxDelay},
    factor: ${options.broker.retry.factor},
    check: err => err && !!err.retryable,
  },

  contextParamsCloning: false,
  maxCallLevel: 100,
  //heartbeatInterval: 5,
  //heartbeatTimeout: 15,
  
  tracking: {
    enabled: true,
    shutdownTimeout: 5000,
  },

  disableBalancer: false,

  registry: {
    discoverer: {
      type: "${options.serviceDiscovery.discoverer === "etcd3" ? "Etcd3" : options.serviceDiscovery.discoverer}",
      options: {
        ${options.serviceDiscovery.discoverer === "Redis" ? `
        redis: {
          port: 6379,
          host: "redis-server",
          password: "redis",
          db: 1
        },` : options.serviceDiscovery.discoverer === "etcd3" ? `
        etcd: {
          hosts: "etcd-server:2379",
        },` : ''}
        heartbeatInterval: ${options.serviceDiscovery.heartbeatInterval},
        heartbeatTimeout: ${options.serviceDiscovery.heartbeatTimeout},
      }
    },
    strategy: "${options.loadBalancer.strategy}",
    strategyOptions: {
      sampleCount: ${options.loadBalancer.sampleCount},
      lowCpuUsage: ${options.loadBalancer.lowCpuUsage},
      lowLatency: ${options.loadBalancer.lowLatency},
      collectCount: ${options.loadBalancer.collectCount},
      pingInterval: ${options.loadBalancer.pingInterval},
    },
    preferLocal: true
  },

  circuitBreaker: {
    enabled: ${options.broker.circuitBraker.enabled},
    threshold: ${options.broker.circuitBraker.threshold},
    windowTime: ${options.broker.circuitBraker.windowTime},
    minRequestCount: ${options.broker.circuitBraker.minRequestCount},
    halfOpenTime: ${options.broker.circuitBraker.halfOpenTime},
    check: err => err && err.code >= 500
  },   

  bulkhead: {
    enabled: ${options.broker.bulkhead.enabled},
    concurrency: ${options.broker.bulkhead.concurrency},
    maxQueueSize: ${options.broker.bulkhead.maxQueueSize},
  },

  transit: {
    maxQueueSize: 50 * 1000,
    disableReconnect: false,
    disableVersionCheck: false,
    packetLogFilter: ["HEARTBEAT"]
  },

  uidGenerator: null,

  errorHandler: null,
  
  cacher: "MemoryLRU",
  serializer: "${options.broker.serializer}",

  validator: false,
  errorRegenerator: null,

  metrics: {
    enabled: ${options.metrics.metrics === "Disabled" ? "false" : "true"},
    reporter: [
      {
${options.metrics.metrics === "Console" ? 
`        type: "Console",
        options: {
          // Printing interval in seconds
          interval: ${options.metrics.interval},
          // Custom logger.
          logger: null,
          // Using colors
          colors: true,
          // Prints only changed metrics, not the full list.
          onlyChanges: ${options.metrics.onlyChanges}
        }`
        : options.metrics.metrics === "CSV" ?
`        type: "CSV",
        options: {
          // Folder of CSV files.
          folder: "./reports/metrics",
          // CSV field delimiter
          delimiter: ",",
          // CSV row delimiter
          rowDelimiter: "\\n",
          // Saving mode. 
          //   - "metric" - save metrics to individual files
          //   - "label" - save metrics by labels to individual files
          mode: "metric",
          // Saved metrics types.
          types: null,
          // Saving interval in seconds
          interval: ${options.metrics.interval},
          // Custom filename formatter
          filenameFormatter: null,
          // Custom CSV row formatter.
          rowFormatter: null,
        }`: ''
        }
      }
    ]
  },

  tracing: {
    enabled: ${options.tracing.enable},
    exporter: [
      "${options.tracing.exporter}",
    ]
  },

  internalServices: true,
  internalMiddlewares: true,

  hotReload: true,

  //middlewares: ["MyMiddleware"],

  replDelimiter: "mol $",
  replCommands: [],

  metadata: {
  },

  skipProcessEventRegistration: false,
  maxSafeObjectSize: null,

  ServiceFactory: null,
  ContextFactory: null,

  created(broker) {},

  started(broker) {},

  stopped(broker) {}
}
  `;
  return config;
}
