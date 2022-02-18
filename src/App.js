import logo from './logo.svg';
import './App.css';

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState } from 'react';
import { ClassDiagram } from './components/ClassDiagram';
import { MicroservicesDiagram } from './components/MicroservicesDiagram';
import { MicroservicesDiagramV2 } from './components/MicroservicesDiagramV2';
import { MicroservicesDiagramV3 } from './components/MicroservicesDiagramV3';

let globalDiagram;

let nodes_arr = [
  { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
  { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
  { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
  { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
];

let links_arr = [
  { key: -1, from: 0, to: 1 },
  { key: -2, from: 0, to: 2 },
  { key: -3, from: 1, to: 1 },
  { key: -4, from: 2, to: 3 },
  { key: -5, from: 3, to: 0 }
];

/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
 function initDiagram() {
  const $ = go.GraphObject.make;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const diagram =
    $(go.Diagram,
      {
        'undoManager.isEnabled': true,  // must be set to allow for model change listening
        // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
        'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        model: new go.GraphLinksModel(
          {
            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
          })
      });

  // define a simple Node template
  diagram.nodeTemplate =
    $(go.Node, 'Auto',  // the Shape will go around the TextBlock
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, 'RoundedRectangle',
        { name: 'SHAPE', fill: 'white', strokeWidth: 0 },
        // Shape.fill is bound to Node.data.color
        new go.Binding('fill', 'color')),
      $(go.TextBlock,
        { margin: 8, editable: true },  // some room around the text
        new go.Binding('text').makeTwoWay()
      )
    );

  diagram.groupTemplate =
    $(go.Group, "Vertical",
      $(go.Panel, "Auto",
        $(go.Shape, "Rectangle",  // surrounds the Placeholder
          { fill: "rgba(128,128,128,0.33)" }),
        $(go.Panel, "Table", { background: "lightgray" },
        $(go.RowColumnDefinition,
          { column: 0, alignment: go.Spot.Left}),
        $(go.RowColumnDefinition,
          { column: 2, alignment: go.Spot.Right }),
        $(go.TextBlock,  // the node title
          { column: 0, row: 0, columnSpan: 3, alignment: go.Spot.Center,
            font: "bold 10pt sans-serif", margin: new go.Margin(4, 2) },
          new go.Binding("text", "key")),
        $(go.Panel, "Horizontal",
          { column: 0, row: 1 },
          $(go.Shape,  // the "A" port
            { width: 6, height: 6, portId: "A", toSpot: go.Spot.Left,
              toLinkable: true, toMaxLinks: 1 }),  // allow user-drawn links to here
          $(go.TextBlock, "A")  // "A" port label
        ),
        $(go.Panel, "Horizontal",
          { column: 0, row: 2 },
          $(go.Shape,  // the "B" port
            { width: 6, height: 6, portId: "B", toSpot: go.Spot.Left,
              toLinkable: true, toMaxLinks: 1 }),  // allow user-drawn links to here
          $(go.TextBlock, "B")  // "B" port label
        ),
        $(go.Panel, "Horizontal",
          { column: 2, row: 1, rowSpan: 2 },
          $(go.TextBlock, "Out"),  // "Out" port label
          $(go.Shape,  // the "Out" port
            { width: 6, height: 6, portId: "Out", fromSpot: go.Spot.Right,
              fromLinkable: true })  // allow user-drawn links from here
        )
        ),
        $(go.Placeholder,    // represents the area of all member parts,
          { padding: 20})  // with some extra padding around them
      ),
      $(go.TextBlock,         // group title
        { alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" },
        new go.Binding("text", "key"))
      //$(go.Shape, "Rectangle", { fill: "lightgray" }),
      /*
      $(go.Panel, "Table", { background: "lightgray" },
        $(go.RowColumnDefinition,
          { column: 0, alignment: go.Spot.Left}),
        $(go.RowColumnDefinition,
          { column: 2, alignment: go.Spot.Right }),
        $(go.TextBlock,  // the node title
          { column: 0, row: 0, columnSpan: 3, alignment: go.Spot.Center,
            font: "bold 10pt sans-serif", margin: new go.Margin(4, 2) },
          new go.Binding("text", "key")),
        $(go.Panel, "Horizontal",
          { column: 0, row: 1 },
          $(go.Shape,  // the "A" port
            { width: 6, height: 6, portId: "A", toSpot: go.Spot.Left,
              toLinkable: true, toMaxLinks: 1 }),  // allow user-drawn links to here
          $(go.TextBlock, "A")  // "A" port label
        ),
        $(go.Panel, "Horizontal",
          { column: 0, row: 2 },
          $(go.Shape,  // the "B" port
            { width: 6, height: 6, portId: "B", toSpot: go.Spot.Left,
              toLinkable: true, toMaxLinks: 1 }),  // allow user-drawn links to here
          $(go.TextBlock, "B")  // "B" port label
        ),
        $(go.Panel, "Horizontal",
          { column: 2, row: 1, rowSpan: 2 },
          $(go.TextBlock, "Out"),  // "Out" port label
          $(go.Shape,  // the "Out" port
            { width: 6, height: 6, portId: "Out", fromSpot: go.Spot.Right,
              fromLinkable: true })  // allow user-drawn links from here
        )
      )
      */
    );

  globalDiagram = diagram;
  return diagram;
}

// render function...
function App() {
  const [nodes, setNodes] = useState(nodes_arr);
  const [links, setLinks] = useState(links_arr);

  function clickHandler(e) {
    setNodes([...nodes, { key: 4, text: 'Delta', color: 'yellow', loc: '170 150'}]);
    console.log(nodes)
  }

  function createMicroservice(e) {
    setNodes([...nodes, { key: "Omega", isGroup: true }, { key: "Beta", text: 'Gamma', color: 'lightgreen', group: "Omega" },]);
    console.log(nodes)
  }

  return (
    <div>
      <button onClick={clickHandler}>Click</button>
      <button onClick={createMicroservice}>Create Microservices</button>
      <MicroservicesDiagramV3></MicroservicesDiagramV3>
    </div>
  );
}

export default App;
