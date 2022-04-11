module.exports = function generateConfig(options) {
  const namespace = "dev";
  const config = 
`"use strict";

module.exports = {
  namespace: "${namespace}",
  nodeID: "node-main",

  logger: "${options.logger.logger}",
  logLevel: "${options.logger.logLevel}",
  logFormatter: "${options.logger.formatter}",
  logObjectPrinter: null,

  transporter: "${options.broker.transporter}",

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
      type: "${options.serviceDiscovery.discoverer}",
      options: {
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

  validator: true,
  errorRegenerator: null,

  metrics: {
    enabled: true,
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
        :
`        type: "CSV",
        options: {
            // Folder of CSV files.
            folder: "./reports/metrics",
            // CSV field delimiter
            delimiter: ",",
            // CSV row delimiter
            rowDelimiter: "\n",
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
        }`
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
