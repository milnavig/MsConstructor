"use strict";

module.exports = {
  namespace: "dev",
  //nodeID: "node-main",

  logger: "Console",
  logLevel: "info",
  logFormatter: "full",
  logObjectPrinter: null,

  transporter: "TCP",

  requestTimeout: 5000,
  retryPolicy: {
    enabled: false,
    retries: 5,
    delay: 100,
    maxDelay: 2000,
    factor: 2,
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
      type: "Local",
      options: {
        heartbeatInterval: 10,
        heartbeatTimeout: 30,
      }
    },
    strategy: "RoundRobin",
    strategyOptions: {
      sampleCount: 3,
      lowCpuUsage: 10,
      lowLatency: 10,
      collectCount: 5,
      pingInterval: 10,
    },
    preferLocal: true
  },

  circuitBreaker: {
    enabled: false,
    threshold: 0.5,
    windowTime: 60,
    minRequestCount: 20,
    halfOpenTime: 10000,
    check: err => err && err.code >= 500
  },   

  bulkhead: {
    enabled: false,
    concurrency: 3,
    maxQueueSize: 10,
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
  serializer: "JSON",

  validator: true,
  errorRegenerator: null,

  metrics: {
    enabled: true,
    reporter: [
      {
        type: "Console",
        options: {
            // Printing interval in seconds
            interval: 5,
            // Custom logger.
            logger: null,
            // Using colors
            colors: true,
            // Prints only changed metrics, not the full list.
            onlyChanges: true
        }
      }
    ]
  },

  tracing: {
    enabled: false,
    exporter: [
      "Console",
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
  