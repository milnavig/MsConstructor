import { ReactDiagram } from 'gojs-react';
import { DbManagementBar } from './DbManagementBar';

import './../css/dbManagementBar.scss';

export function DbDiagram({globalDiagram, nodes, setNodes, init, currentModel, setCurrentModel, dbRelationship}) {
  function addTable(e, data) {
    e.preventDefault();

    const table = {
      key: data.name,
      widths: [NaN, NaN, 60],
      fields: data.fields.map(d => ({ name: d.name, datatype: d.type, meta: "", type: d.pk ? "pk" : "field" })),
      loc: "0 0"
    };
    
    setNodes({...nodes, [currentModel]: [...nodes[currentModel], table]});
    
    const d = globalDiagram.current;
    d.model.addNodeData(table);
  }

  return (
    <div>
      <DbManagementBar 
        currentModel={currentModel} 
        onClick={(e) => {
          setCurrentModel('main');
        }} 
        addTable={addTable} 
        selectRelationship={(type) => dbRelationship.current = type}
      ></DbManagementBar>
      <ReactDiagram
        initDiagram={init}
        divClassName='diagram-component'
      />
    </div>
  );
}
