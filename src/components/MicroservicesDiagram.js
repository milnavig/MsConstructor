import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState, useEffect } from 'react';
import { MetadataModal } from './modals/MetadataModal';
import { MsManagementBar } from './MsManagementBar';
import { GatewayModal } from './modals/GatewayModal';
import { EventModal } from './modals/EventModal';

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
  metadataToggle, 
  setMetadataToggle,
  metadata, 
  setMetadata,
  eventToggle, 
  setEventToggle,
  currentLink, 
  setCurrentLink,
}) {
  const [gatewayToggle, setGatewayToggle] = useState(false);

  function addMethod(event, data) {
    event.preventDefault();
    
    const microserviceName = data.microservice;
    const methodName = data.name;
    const props = data.props.map(prop => ({ name: prop.name, type: prop.type }));

    setNodes({...nodes, [currentModel]: [...nodes[currentModel], {
      key: methodName, group: microserviceName, color: go.Brush.randomColor(), type: "method", parameters: props
    }]});
    diagram.current.model.addNodeData({
      key: methodName, group: microserviceName, color: go.Brush.randomColor(), type: "method", parameters: props
    });
  }

  function addMicroservice(e) {
    setNodes({...nodes, [currentModel]: [...nodes[currentModel], { key: 'microservice-45', type: "microservice", isGroup: true }]});
    diagram.current.model.addNodeData({ key: 'microservice-45', type: "microservice", isGroup: true });
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
        //node.data.http_method = ep.http_method;
        //node.data.url = ep.url;
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
    <GatewayModal 
      isOpen={gatewayToggle} 
      toggle={() => setGatewayToggle(false)}
      handleAddGateway={handleAddGateway}
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
      addMicroservice={addMicroservice}
      arrowType={arrowType}
      microserviceName={microserviceName.current}
      displayForm={displayForm} 
      setDisplayForm={setDisplayForm}
      setGatewayFrom={() => setGatewayToggle(true)}
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
    <ReactDiagram
      initDiagram={init}
      divClassName='diagram-component'
      //skipsDiagramUpdate={false}
      //onModelChange={handleModelChange}
    />
  </div>);
}
