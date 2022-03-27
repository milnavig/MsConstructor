const fs = require('fs');
const generateDB = require('./../logic/generateDB.js');
const generateService = require('./../logic/generateService.js');
const generatePackage = require('./../logic/generatePackage.js');
const generateBatFile = require('./../logic/generateBatFile.js');
const generateDockerfile = require('./../logic/generateDockerfile');
const generateDockerignore = require('./../logic/generateDockerignore');
const generateGateway = require('./../logic/generateGateway');
const generateDockerCompose = require('./../logic/generateDockerCompose');
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

    generatePackages(appName);

    generateDockerfiles(appName);

    generateDockerignore();

    generateGateways(appName, model);

    generateDockerComposeFiles(appName, model);
    
    return res.json("");
  }

  async read(req, res) {
    
  }
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
  const gtw = generateGateway(gatewayData);

  fs.writeFile(`./output/${appName}/services/gateway.js`, gtw, function (err) {
    if (err) throw err;
    console.log(`Created gateway.js file!`);
  });
}

function generateDbFiles(appName, model) {
  //let rawdata = fs.readFileSync('./data/scheme.json');
  //let data = JSON.parse(rawdata);
  //console.log(JSON.parse(data.main))

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

      fs.writeFile(`./output/${appName}/db/${key}.sql`, sql, function (err) {
        if (err) throw err;
        console.log(`Created ${key}.sql file!`);
      });
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
    let nodes = microservicesData.nodeDataArray.filter(node => ms.key === node.group);

    nodes.forEach(n => {
      microservicesData.linkDataArray.forEach(l => {
        if (n.key === l.from || n.key === l.to) {
          actions[n.key] = {name: n.key, parameters: n.parameters, calls: []};
          microservicesData.linkDataArray.filter(l => l.from === n.key).forEach(l => {
            actions[n.key].calls.push({type: "balanced_event", microservice: l.toPort.replace('_in', ''), action: l.to});
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

    const code = generateService(ms.key, Object.values(actions), Object.values(methods), meta, events);

    fs.writeFile(`./output/${appName}/services/${ms.key}.js`, code, function (err) {
      if (err) throw err;
      console.log(`Created ${ms.key}.js`);
    });
  });
}

function generateBatFiles(appName) {
  fs.writeFile(`./output/${appName}/deploy.bat`, generateBatFile(), function (err) {
    if (err) throw err;
    console.log('Created bat file!');
  });
}

function generatePackages(appName) {
  fs.writeFile(`./output/${appName}/package.json`, generatePackage(), function (err) {
    if (err) throw err;
    console.log('Created package.json file!');
  });
}

function generateDockerfiles(appName) {
  fs.writeFile(`./output/${appName}/Dockerfile`, generateDockerfile(), function (err) {
    if (err) throw err;
    console.log('Created dockerfile!');
  });
}

function generateDockerComposeFiles(appName, model) {
  const isGateway = JSON.parse(model['main']).nodeDataArray.filter(n => n.group === 'gateway') ? true : false;

  const main_scheme = JSON.parse(model["main"]);
  const services = main_scheme.nodeDataArray.filter(n => n.type === 'microservice').map(ms => ({name: ms.key}));
  const dbs = main_scheme.nodeDataArray.filter(n => n.type === 'db').map(ms => ({name: ms.key}));
  main_scheme.linkDataArray.filter(n => n.relationship === 'db').forEach(l => {
    const service = services.find(s => s.name === l.from);
    service.db_name = l.to;
  });

  fs.writeFile(`./output/${appName}/docker-compose.yml`, generateDockerCompose(isGateway, services, dbs), function (err) {
    if (err) throw err;
    console.log('Created docker-compose.yml!');
  });
}

module.exports = new MicroserviceController();
