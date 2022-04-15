module.exports = function generateDockerCompose(isGateway, services, databases) {
  const file = 
`version: "3.3"

services:
${ isGateway ? 
`  api:
    build:
      context: .
    image: microservices
    env_file: docker-compose.env
    environment:
      SERVICES: api
      PORT: 3000
    depends_on:
      - nats
    ports:
      - 5000:3000
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api-gw.rule=PathPrefix(${`/`})"
      - "traefik.http.services.api-gw.loadbalancer.server.port=3000"
    networks:
      - internal` : null
}

${services.map(s => 
`  ${s.name}:
    build:
      context: .
    image: microservices
    env_file: docker-compose.env
    environment:
      SERVICES: ${s.name}
    depends_on:
      - nats
      ${s.db_name ? `- ${s.db_name}` : ''}
    networks:
      - internal
      `).join('\n')}

${databases.map((db, i) => 
`  ${db.name}:
    build: ./db/${db.name}
    image: postgres
    ports:
      - '${5438 + i}:${5432}'
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${db.name}
    networks:
      - internal
`).join('\n')}

  nats:
    image: nats:2
    networks:
      - internal

  traefik:
    image: traefik:v2.1
    command:
      - "--api.insecure=true" # Don't do that in production!
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
    ports:
      - 3000:80
      - 3001:8080
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - internal
      - default

networks:
  internal:

volumes:
  data: 
  `;
  return file;
}
