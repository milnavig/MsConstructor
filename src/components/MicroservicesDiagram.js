import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState } from 'react';
import { MetadataModal } from './modals/MetadataModal';
import { MsManagementBar } from './MsManagementBar';

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
}) {
  //const [displayForm, setDisplayForm] = useState(false);

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
    setNodes({...nodes, [currentModel]: [...nodes[currentModel], { key: 'microservice-45', isGroup: true }]});
    diagram.current.model.addNodeData({ key: 'microservice-45', isGroup: true });
  }

  function clear() {
    diagram.current.clear();
    setNodes({});
    // add setLinks({}) in future
  }

  return (<div>
    <MsManagementBar 
      addMethod={addMethod} 
      addMicroservice={addMicroservice}
      arrowType={arrowType}
      microserviceName={microserviceName.current}
      displayForm={displayForm} 
      setDisplayForm={setDisplayForm}
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
      //onModelChange={handleModelChange}
    /> 
  </div>);
}
