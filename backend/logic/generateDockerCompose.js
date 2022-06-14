module.exports = function generateDockerCompose(isGateway, services, databases, options) {
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
      - broker
    ports:
      - 5000:3000
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api-gw.rule=PathPrefix(${`/`})"
      - "traefik.http.services.api-gw.loadbalancer.server.port=3000"
    networks:
      - internal` : ''
}

${services.map(s => {
  return new Array(Number(s.instances)).fill(0).map((inst, id) => `  ${s.name + '_' + id}:
    build:
      context: .
    image: microservices
    env_file: docker-compose.env
    environment:
      SERVICES: ${s.name}
    depends_on:
      - broker
      ${s.db_name ? `- ${s.db_name}` : ''}
    networks:
      - internal
      `).join('\n');
  }).join('\n')}

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
${(function(){switch(options.broker.transporter) {
  case 'NATS':
    return `
  broker:
    image: nats:2
    hostname: nats
    networks:
      - internal`
  case 'Redis':
    return `
  broker:
    image: redis
    hostname: redis-server
    ports:
      - '6379:6379'
    environment:
      - REDIS_PASSWORD=redis
    networks:
      - internal`
  case 'MQTT':
    return `
  broker:
    image: eclipse-mosquitto
    hostname: mqtt-server
    ports:
      - '1883:1883'
    volumes: 
      - ./mosquitto:/mosquitto/config
    networks:
      - internal`
  case 'AMQP (0.9)':
    return `
  broker: 
    image: rabbitmq
    hostname: rabbitmq-server
    networks:
      - internal`
  case 'AMQP (1.0)':
    return `
  broker: 
    image: rmohr/activemq
    hostname: activemq-server
    environment:
      - ACTIVEMQ_REMOVE_DEFAULT_ACCOUNT=true
      - ACTIVEMQ_ADMIN_LOGIN=admin
      - ACTIVEMQ_ADMIN_PASSWORD=admin
      - ACTIVEMQ_STATIC_TOPICS=static-topic-1;static-topic-2
      - ACTIVEMQ_STATIC_QUEUES=static-queue-1;static-queue-2
      - ACTIVEMQ_ENABLED_SCHEDULER=true
      - ACTIVEMQ_MIN_MEMORY=512
      - ACTIVEMQ_MAX_MEMORY=2048
    ports:
      - '5672:5672'
    networks:
      - internal`
  case 'Kafka':
    return `
  zookeeper:
    image: bitnami/zookeeper:latest
    hostname: zookeeper
    ports:
      - '2181:2181'
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
    networks:
      - internal

  broker:
    image: wurstmeister/kafka
    restart: unless-stopped
    ports: 
      - '9092:9092'
    hostname: kafka
    environment:
      - KAFKA_ADVERTISED_HOST_NAME=kafka   
      - KAFKA_ADVERTISED_PORT=9092
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
      - KAFKA_CREATE_TOPICS=test_topic:1:1
    networks:
      - internal`
  case 'NATS Streaming (STAN)':
    return `
  broker:
    image: nats-streaming
    hostname: nats-streaming-server
    networks:
      - internal`
  default:
    return ''
}})()}
${(function(){switch(options.serviceDiscovery.discoverer) {
  case 'etcd3':
    return `
  balancer:
    image: 'bitnami/etcd:latest'
    hostname: etcd-server
    environment:
      - ALLOW_NONE_AUTHENTICATION=yes
    networks:
      - internal`
  case 'Redis':
    return options.broker.transporter === 'Redis' ? `` : `
  balancer:
    image: redis
    hostname: redis-server
    ports:
      - '6379:6379'
    environment:
      - REDIS_PASSWORD=redis
    networks:
      - internal`
  default:
    return ''
}})()}

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
