const fs = require('fs');
const generateDB = require('./../logic/generateDB.js');
const generateService = require('./../logic/generateService.js');
const generatePackage = require('./../logic/generatePackage.js');
const generateBatFile = require('./../logic/generateBatFile.js');
const generateDockerfile = require('./../logic/generateDockerfile');
const generateDockerignore = require('./../logic/generateDockerignore');
const generateGateway = require('./../logic/generateGateway');
const generateDockerCompose = require('./../logic/generateDockerCompose');
const generateConfig = require('./../logic/generateConfig');
const generateEnvFile = require('./../logic/generateEnvFile');
const generateDockerfileDB = require('./../logic/generateDockerfileDB');
const archiver = require('archiver');

const path = require('path');

class MicroserviceController {
  async create(req, res) {
    const model = req.body;
    const appName = req.body.options.name ? `/${req.body.options.name}` : `/app${Math.round(Math.random() * 100)}`;
    const appPath = path.join(__dirname, '../output' + appName);
    if (!fs.existsSync(appPath)) {
      fs.mkdirSync(appPath);
    }

    generateServices(appName, model);

    generateDbFiles(appName, model);

    generateBatFiles(appName);

    generatePackages(appName, model);

    generateDockerfiles(appName);

    generateDockerignores(appName);

    generateConfigs(appName, model);

    generateGateways(appName, model);
    
    generateEnvFiles(appName);

    generateDockerComposeFiles(appName, model);
	
    let transporter = "TRANSPORTER=nats://nats:4222\n";
    if (model.options.broker.transporter === "Redis") transporter = "TRANSPORTER=redis://redis-server:6379\n";
    if (model.options.broker.transporter === "MQTT") transporter = "TRANSPORTER=mqtt://mqtt-server:1883\n";
    if (model.options.broker.transporter === "AMQP (0.9)") transporter = "TRANSPORTER=amqp://rabbitmq-server:5672\n";
    if (model.options.broker.transporter === "AMQP (1.0)") transporter = "TRANSPORTER=amqp10://admin:admin@activemq-server:5672\n";
    if (model.options.broker.transporter === "NATS Streaming (STAN)") transporter = "TRANSPORTER=stan://nats-streaming-server:4222\n";
    if (model.options.broker.transporter === "Kafka") transporter = "TRANSPORTER=kafka://kafka:9092\n";
    let balancer = '\n';
    if (model.options.serviceDiscovery.discoverer === "Redis") balancer = "BALANCER=redis://redis-server:6379\n";
    if (model.options.serviceDiscovery.discoverer === "etcd3") balancer = "BALANCER=etcd3://etcd-server:2379\n";
	  const envData = "SERVICEDIR=services\n" +
      transporter +
      balancer +
      "CACHER=Memory";

    fs.writeFileSync(`./output/${appName}/docker-compose.env`, envData);

    /* let data = zip.folder(appPath);
    data.generateAsync({type: "nodebuffer"}).then((content) => {
      fs.writeFileSync(`./output/${appName}/app.zip`, content);
      console.log(`Created archive`);
    }); */

    if (model.options.broker.transporter === "MQTT") {
      const mosquittoPath = path.join(__dirname, '../output' + appName + '/mosquitto');
      if (!fs.existsSync(mosquittoPath)) {
        fs.mkdirSync(mosquittoPath);
      }
      const mqttEnv = "allow_anonymous true\n" + "listener 1883";

      fs.writeFileSync(`./output/${appName}/mosquitto/mosquitto.conf`, mqttEnv);
    }

    const resPath = `./output/${appName}/app.zip`;

    zipDirectory(appPath, resPath).then(() => {
      console.log(`Created archive`);
    
      return res.download(resPath);
    });
  }

  async read(req, res) {
    
  }
}

function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

function generateEnvFiles(appName) {
  fs.writeFileSync(`./output/${appName}/.env`, generateEnvFile());
  console.log(`Created .env file!`);
}

function generateDockerignores(appName) {
  fs.writeFileSync(`./output/${appName}/.dockerignore`, generateDockerignore());
  console.log(`Created dockerignore file!`);
}

function generateConfigs(appName, model) {
  fs.writeFileSync(`./output/${appName}/moleculer.config.js`, generateConfig(model.options));
  console.log(`Created moleculer config file!`);
}

function generateGateways(appName, model) {
  const gatewayData = JSON.parse(model['main']).nodeDataArray.filter(n => n.group === 'gateway');
  const endpointKeys = gatewayData.map(g => g.key);
  const gatewayLinks = JSON.parse(model['main']).linkDataArray.filter(n => endpointKeys.find(k => k === n.from));
  gatewayData.map(d => {
    const endpoints = gatewayLinks.find(l => d.key === l.from);
    d.microservice = endpoints.toPort.replace('_in', '');
    d.method = endpoints.to;
  });
  //console.log(gatewayData);
  const gtw = generateGateway(gatewayData, model.options.authorization, model.options.authentification);

  fs.writeFileSync(`./output/${appName}/services/api.service.js`, gtw);
  console.log(`Created api.js file!`);
}

function generateDbFiles(appName, model) {
  //let rawdata = fs.readFileSync('./data/scheme.json');
  //let data = JSON.parse(rawdata);

  const dbPath = path.join(__dirname, '../output' + appName + '/db');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  for (let key in model) {
    if (key.endsWith("db")) {
      let db = JSON.parse(model[key]);
      const tables = db.nodeDataArray.map(t => ({
        name: t.key,
        fields: t.fields.map(f => ({name: f.name, datatype: f.datatype, meta: f.meta, type: f.type})),
        pk: t.fields.find((f) => f.type === "pk")?.name,
        fk_array: db.linkDataArray.filter(l => l.to === t.key).map(l => ({name: l.toPort, table: l.from, field: l.fromPort})),
      }));
      const sql = generateDB(tables);

      const folderPath = path.join(__dirname, '../output' + appName + '/db/' + key);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(`./output/${appName}/db/${key}/script.sql`, sql);
      const dockerfile = generateDockerfileDB(key);

      fs.writeFileSync(`./output/${appName}/db/${key}/Dockerfile`, dockerfile);
      console.log(`Created ${key}.sql file!`);
    }
  }
}

function generateServices(appName, model) {
  const servicePath = path.join(__dirname, '../output' + appName + '/services');
  if (!fs.existsSync(servicePath)) {
    fs.mkdirSync(servicePath);
  }
  
  const microservicesData = JSON.parse(model.main);
  //console.log(microservicesData);

  let microservices = microservicesData.nodeDataArray.filter(node => node.type === "microservice");

  microservices.forEach(ms => {
    let methods = {};
    let actions = {};

    let hasDB = false;
    let dbName;
    microservicesData.linkDataArray.filter(n => n.relationship === 'db').forEach(l => {
      if (ms.key === l.from) {
        hasDB = true;
        dbName = l.to;
      }
    });

    let nodes = microservicesData.nodeDataArray.filter(node => ms.key === node.group);

    nodes.forEach(n => {
      microservicesData.linkDataArray.forEach(l => {
        if (n.key === l.from || n.key === l.to) {
          actions[n.key] = {name: n.key, parameters: n.parameters, calls: [], events: []};
          microservicesData.linkDataArray.filter(l => l.from === n.key).forEach(l => {
            if (l.relationship === "event") {
              actions[n.key].events.push({type: "event", microservice: l.toPort.replace('_in', ''), event_name: l.eventName});
            } else if (l.relationship === "rpc") {
              actions[n.key].calls.push({type: "rpc", microservice: l.toPort.replace('_in', ''), action: l.to});
            }
          });
        }
      })
    });

    //let rpc_calls = microservicesData.linkDataArray.filter(link => link.relationship === "rpc");

    nodes.forEach(n => {
      let flag = false;
      Object.values(actions).forEach(a => {
        if (a.name === n.key) flag = true;
      });
      if (!flag) methods[n.key] = {name: n.key, parameters: n.parameters};;
    });

    let links = microservicesData.linkDataArray.filter(link => link.relationship === "event" && link.to === ms.key);
    let events = links.map(link => ({name: link.eventName}));
    let meta = ms.meta ? Object.entries(ms.meta).map(entry => ({name: entry[0], value: entry[1]})) : [];

    const code = generateService(ms.key, Object.values(actions), Object.values(methods), hasDB, dbName, meta, events);

    fs.writeFileSync(`./output/${appName}/services/${ms.key}.service.js`, code);
    console.log(`Created ${ms.key}.js`);
  });
}

function generateBatFiles(appName) {
  fs.writeFileSync(`./output/${appName}/deploy.bat`, generateBatFile());
  console.log('Created bat file!');
}

function generatePackages(appName, model) {
  fs.writeFileSync(`./output/${appName}/package.json`, generatePackage(model.options));
  console.log('Created package.json file!');
}

function generateDockerfiles(appName) {
  fs.writeFileSync(`./output/${appName}/Dockerfile`, generateDockerfile());
  console.log('Created dockerfile!');
}

function generateDockerComposeFiles(appName, model) {
  const isGateway = JSON.parse(model['main']).nodeDataArray.filter(n => n.group === 'gateway') ? true : false;

  const main_scheme = JSON.parse(model["main"]);
  const services = main_scheme.nodeDataArray.filter(n => n.type === 'microservice').map(ms => ({name: ms.key, instances: ms.instances ?? 1}));
  const dbs = main_scheme.nodeDataArray.filter(n => n.type === 'db').map(ms => ({name: ms.key}));
  main_scheme.linkDataArray.filter(n => n.relationship === 'db').forEach(l => {
    const service = services.find(s => s.name === l.from);
    service.db_name = l.to;
  });

  fs.writeFileSync(`./output/${appName}/docker-compose.yml`, generateDockerCompose(isGateway, services, dbs, model.options));
  console.log('Created docker-compose.yml!');
}

module.exports = new MicroserviceController();
