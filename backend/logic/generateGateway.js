
module.exports = function generateGateway(endpoints) {
  const API_gateway = 
`const HTTPServer = require("moleculer-web"); // API gateway

module.exports = {
  name: "gateway",
  mixins: [HTTPServer],

  settings: {
    // Global CORS settings for all routes
    cors: {
      // Configures the Access-Control-Allow-Origin CORS header.
      origin: "*",
      // Configures the Access-Control-Allow-Methods CORS header. 
      methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
      // Configures the Access-Control-Allow-Headers CORS header.
      allowedHeaders: [],
      // Configures the Access-Control-Expose-Headers CORS header.
      exposedHeaders: [],
      // Configures the Access-Control-Allow-Credentials CORS header.
      credentials: false,
      // Configures the Access-Control-Max-Age CORS header.
      maxAge: 3600
    },
    
    routes: [{
      path: "/public",
      aliases: {
${
endpoints.map(endpoint => 
`        "${endpoint.http_method} ${endpoint.url}": "${endpoint.microservice}.${endpoint.method}",`).join('\n')
}
      }
    }]
  }
}
  `;
  return API_gateway;
}
