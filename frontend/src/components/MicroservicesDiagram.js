import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState } from 'react';
import { MetadataModal } from './modals/MetadataModal';
import { MsManagementBar } from './MsManagementBar';
import { GatewayModal } from './modals/GatewayModal';
import { EventModal } from './modals/EventModal';
import { MicroservicesModal } from './modals/MicroservicesModal';
import { InstancesModal } from './modals/InstancesModal';

export function MicroservicesDiagram({
  diagram, 
  microserviceName, 
  currentModel,
  init,
  nodes,
  setNodes,
  arrowType,
  isFormDisplayed: displayForm, 
  setFormDisplay: setDisplayForm,
  isVarFormDisplayed,
  setVarFormDisplay,
  metadataToggle, 
  setMetadataToggle,
  instancesToggle,
  setInstancesToggle,
  metadata, 
  setMetadata,
  instances,
  setInstances,
  eventToggle, 
  setEventToggle,
  currentLink, 
  setCurrentLink,
  moleculerOptions,
}) {
  const [gatewayToggle, setGatewayToggle] = useState(false);
  const [microserviceNameToggle, setMicroserviceNameToggle] = useState(false);

  function addMethod(event, data) {
    event.preventDefault();
    const microserviceName = data.microservice;
    const methodName = data.name;
    const props = data.props.map(prop => ({ name: prop.name, type: prop.type ?? "any" }));

    setNodes({...nodes, [currentModel]: [...nodes[currentModel], {
      key: methodName, group: microserviceName, color: go.Brush.randomColor(), type: "method", parameters: props
    }]});
    diagram.current.model.addNodeData({
      key: methodName, group: microserviceName, color: go.Brush.randomColor(), type: "method", parameters: props
    });
  }

  function addVariable(event, data) {
    event.preventDefault();
    const microserviceName = data.microservice;
    const variables = Object.values(data.vars).map(variable => ({ key: variable, group: microserviceName, category: "variable", type: "variable"}));

    setNodes({...nodes, [currentModel]: [...nodes[currentModel], ...variables]});
    variables.forEach(v => {
      diagram.current.model.addNodeData(v);
    });
  }
  
  /*
  function addMicroservice(e) {
    setNodes({...nodes, [currentModel]: [...nodes[currentModel], { key: 'microservice-45', type: "microservice", isGroup: true }]});
    diagram.current.model.addNodeData({ key: 'microservice-45', type: "microservice", isGroup: true });
  }
  */

  function saveMicroserviceName(name) {
    setNodes({...nodes, [currentModel]: [...nodes[currentModel], { key: name, type: "microservice", isGroup: true }]});
    diagram.current.model.addNodeData({ key: name, type: "microservice", isGroup: true });
    setMicroserviceNameToggle(false);
  }

  function handleAddGateway(endpoints) {
    const endpoints_arr = endpoints.map((ep, i) => ({key: `endpoint_${i}`, http_method: ep.method ?? "GET", url: '/' + ep.url, group: "gateway", type: "endpoint", category: "api"}));
    if (!diagram.current.findNodeForKey("gateway")) {
      setNodes({...nodes, [currentModel]: [...nodes[currentModel], {
        key: "gateway", name: "gateway", type: "gateway", category: "gateway", isGroup: true
      }, ...endpoints_arr]});
      diagram.current.model.addNodeData({key: "gateway", name: "gateway", type: "gateway", category: "gateway", isGroup: true});
    }
    endpoints_arr.forEach(ep => {
      let node = diagram.current.findNodeForKey(ep.key);
      if (node !== null) {
        diagram.current.startTransaction("");
        node.data = {...node.data, url: ep.url, http_method: ep.http_method};
        diagram.current.commitTransaction("");
      } else {
        diagram.current.model.addNodeData(ep);
      }
    });
  }

  function clear() {
    diagram.current.clear();
    setNodes({});
    // add setLinks({}) in future
  }

  return (<div>
    <MicroservicesModal
      isOpen={microserviceNameToggle} 
      toggle={() => setMicroserviceNameToggle(false)}
      saveMicroserviceName={saveMicroserviceName}
    ></MicroservicesModal>
    <GatewayModal 
      isOpen={gatewayToggle} 
      toggle={() => setGatewayToggle(false)}
      diagram={diagram}
      handleAddGateway={handleAddGateway}
      moleculerOptions={moleculerOptions}
    ></GatewayModal>
    <EventModal
      isOpen={eventToggle} 
      toggle={() => setEventToggle(false)}
      diagram={diagram}
      currentLink={currentLink}
      setCurrentLink={setCurrentLink}
    ></EventModal>
    <MsManagementBar 
      addMethod={addMethod}
      addVariable={addVariable} 
      arrowType={arrowType}
      microserviceName={microserviceName.current}
      displayForm={displayForm} 
      setDisplayForm={setDisplayForm}
      isVarFormDisplayed={isVarFormDisplayed}
      setVarFormDisplay={setVarFormDisplay}
      setGatewayFrom={() => setGatewayToggle(true)}
      setMicroserviceNameToggle={setMicroserviceNameToggle}
      clear={clear}
    ></MsManagementBar>
    <MetadataModal
      diagram={diagram}
      isOpen={metadataToggle}
      toggle={setMetadataToggle}
      microserviceName={microserviceName.current}
      metadata={metadata}
      setMetadata={setMetadata}
    ></MetadataModal>
    <InstancesModal
      diagram={diagram}
      isOpen={instancesToggle}
      toggle={setInstancesToggle}
      microserviceName={microserviceName.current}
      instances={instances}
      setInstances={setInstances}
    ></InstancesModal>
    <ReactDiagram
      initDiagram={init}
      divClassName='diagram-component'
      //skipsDiagramUpdate={false}
      //onModelChange={handleModelChange}
    />
  </div>);
}
