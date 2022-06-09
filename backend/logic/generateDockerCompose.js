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
  case 'AMPQ (0.9)':
    return `
  broker: 
    image: rabbitmq
    hostname: rabbitmq-server
    networks:
      - internal`
  case 'AMPQ (1.0)':
    return `
  broker: 
    image: isikh/rabbitmq_amqp1_0
    hostname: rabbitmq-server
    networks:
      - internal`
  case 'Kafka':
    return `
  zookeeper:
    image: confluentinc/cp-zookeeper:7.0.1
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  broker:
    image: confluentinc/cp-kafka:7.0.1
    container_name: broker
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://broker:29092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1`
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
