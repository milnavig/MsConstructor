import { upload } from '@testing-library/user-event/dist/upload';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState, useRef } from 'react';

let myDiagram;

var nodedata = [
  { key: 'microservice-1', isGroup: true },
  { key: 'microservice-2', isGroup: true },
  { key: 'func1', group: 'microservice-1', color: go.Brush.randomColor(), parameters: [{ name: "amount", type: "Currency" }] },
  { key: 'func2', group: 'microservice-1', color: go.Brush.randomColor(), parameters: [{ name: "amount", type: "Currency" }] },
  { key: 'func3', group: 'microservice-2', color: go.Brush.randomColor(), parameters: [{ name: "amount", type: "Currency" }] },
];
var linkdata = [
  { from: 'microservice-1', to: 'microservice-2', relationship: 'generalization', fromPort: "In", toPort: "Out", },
  { from: 'func1', to: 'func3', relationship: 'generalization', portId: "In" }
];

export function MicroservicesDiagramV2() {
  const [nodes, setNodes] = useState(nodedata);
  const [links, setLinks] = useState(linkdata);
  const [showForm, setShowForm] = useState(false);

  const [microserviceName, setMicroserviceName] = useState('');
  const [methodName, setMethodName] = useState('');
  const [argName, setArgName] = useState('');
  const [typeName, setTypeName] = useState('');

  const arrowType = useRef('generalization');

  function addMethod(e) {
    e.preventDefault();
    setNodes([...nodes, {
      key: methodName, group: microserviceName, color: go.Brush.randomColor(), parameters: [{ name: argName, type: typeName }]
    }]);
    myDiagram.model.addNodeData({
      key: methodName, group: microserviceName, color: go.Brush.randomColor(), parameters: [{ name: argName, type: typeName }]
    })
    console.log(nodes);
  }

  function init() {
    const $ = go.GraphObject.make;
  
    myDiagram =
      $(go.Diagram,
        {
          //initialContentAlignment: go.Spot.Center,  
        });
    
    // define the node template for non-groups
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Rectangle",
          { stroke: null, strokeWidth: 0, width: 250 },
          new go.Binding("fill", "color")),
        $(go.Panel, "Horizontal",
          { alignment: go.Spot.Left },
          $(go.Shape,  
            { width: 4, height: 4, portId: "In", toSpot: go.Spot.LeftSide,
              toLinkable: true })),
        $(go.Panel, "Horizontal",
          { alignment: go.Spot.Right },
          $(go.Shape,  // the "Out" port
            { width: 4, height: 4, portId: "Out", fromSpot: go.Spot.RightSide,
              fromLinkable: true })),
        /*$(go.TextBlock,
          { margin: 20, font: "Bold 14px Sans-Serif" },
          //the text, color, and key are all bound to the same property in the node data
          new go.Binding("text", "key")),
        */
        $(go.Panel, "Horizontal",
          { margin: 20 },
          // method name, underlined if scope=="class" to indicate static method
          $(go.TextBlock,
            { isMultiline: false, editable: true },
            new go.Binding("text", "key").makeTwoWay(),
            //new go.Binding("isUnderline", "scope", s => s[0] === 'c')
          ),
          // method parameters
          $(go.TextBlock, "()",
            // this does not permit adding/editing/removing of parameters via inplace edits
            new go.Binding("text", "parameters", function (parr) {
              var s = "(";
              for (var i = 0; i < parr.length; i++) {
                var param = parr[i];
                if (i > 0) s += ", ";
                s += param.name + ": " + param.type;
              }
              return s + ")";
            })),
          // method return type, if any
          $(go.TextBlock, "",
            new go.Binding("text", "type", t => t ? ": " : "")),
          $(go.TextBlock,
            { isMultiline: false, editable: true },
            new go.Binding("text", "type").makeTwoWay())
        ),
      );
  
    function convertIsTreeLink(r) {
      return r === "generalization";
    }
  
    function convertFromArrow(r) {
      switch (r) {
        case "generalization": return "";
        default: return "";
      }
    }
  
    function makeLayout(horiz) {  // a Binding conversion function
      return new go.GridLayout(
        {
          wrappingColumn: 1, alignment: go.GridLayout.Position,
          cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
        });
    }
  
    function convertToArrow(r) {
      //console.log(r)
      //console.log('Hi')
      switch (r) {
        case "generalization": return "Standard";
        case "aggregation": return "Feather";
        default: return "Triangle";
      }
    }
    
    myDiagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.Orthogonal, corner: 10 },
        //new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
        $(go.Shape, { strokeWidth: 2 }),
        //$(go.Shape, { scale: 1.3, fill: "white" },
        //  new go.Binding("fromArrow", "relationship", convertFromArrow)),
        $(go.Shape, { fill: "white" },
          new go.Binding("toArrow", "relationship", convertToArrow))
      );
  
    function displayForm(e, obj) {
      console.log('Add method');
      //console.log(obj.part.data.key);
      setMicroserviceName(obj.part.data.key)
      setShowForm(true);
    }
  
    // define the group template
    myDiagram.groupTemplate =
      $(go.Group, "Auto",
        { // define the group's internal layout
          layout: $(go.TreeLayout,
            { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false }),
          contextMenu:     // define a context menu for each node
            $("ContextMenu",  // that has one button
              $("ContextMenuButton",
                {
                  "ButtonBorder.fill": "white",
                  "_buttonFillOver": "skyblue"
                },
                $(go.TextBlock, "Add method"),
                { click: displayForm })
              // more ContextMenuButtons would go here
            ),  // end Adornment
          // the group begins unexpanded;
          // upon expansion, a Diagram Listener will generate contents for the group
          isSubGraphExpanded: false,
          // when a group is expanded, if it contains no parts, generate a subGraph inside of it
          subGraphExpandedChanged: group => {
            if (group.memberParts.count === 0) {
              //randomGroup(group.data.key);
            }
          },
          layout: makeLayout(false)
        },
        $(go.Shape, "Rectangle",
          { fill: null, stroke: "gray", strokeWidth: 2 }),
        $(go.Panel, "Horizontal",
          { alignment: go.Spot.Left },
          $(go.Shape,  
            { width: 6, height: 6, portId: "In", toSpot: go.Spot.LeftSide,
              toLinkable: true })),
          $(go.TextBlock, "In"),
        $(go.Panel, "Horizontal",
          { alignment: go.Spot.Right },
          $(go.TextBlock, "Out"),  // "Out" port label
          $(go.Shape,  // the "Out" port
            { width: 6, height: 6, portId: "Out", fromSpot: go.Spot.RightSide,
              fromLinkable: true })),
        $(go.Panel, "Vertical",
          { defaultAlignment: go.Spot.Left, margin: 4 },
          $(go.Panel, "Horizontal",
            { defaultAlignment: go.Spot.Top },
            // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
            $("SubGraphExpanderButton"),
            $(go.TextBlock,
              { font: "Bold 18px Sans-Serif", margin: 4 },
              new go.Binding("text", "key"))
          ),
          // create a placeholder to represent the area where the contents of the group are
          $(go.Placeholder,
            { padding: new go.Margin(0, 10) })
        )  // end Vertical Panel
      );  // end Group
    
    myDiagram.model = new go.GraphLinksModel({
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: nodes,
        linkDataArray: links
    });
  
    // notice whenever a transaction or undo/redo has occurred
    myDiagram.addModelChangedListener(function(evt) {
      //if (evt.xr === 'linkDataArray') evt.Bo.relationship = 'generalization';
    });
  
    myDiagram.addDiagramListener("LinkDrawn", function(e) {
      var link = e.subject;
      //console.log(link.data);
      //link.data.relationship = 'generalization';
      console.log(arrowType);
      link.data.relationship = arrowType.current;
      e.diagram.model.setCategoryForLinkData(link.data, link.data.relationship);
  
      const tool = myDiagram.toolManager.linkingTool;
      console.log(tool.archetypeLinkData);
      // log model
      var modelAsText = myDiagram.model.toJson();
      console.log(modelAsText);
    });
  
  
    return myDiagram;
  }

  return (
    <div>
      <button onClick={(e) => arrowType.current = 'generalization'}>generalization</button>
      <button onClick={(e) => arrowType.current = 'aggregation'}>aggregation</button>
      { showForm ? 
        <form>
          <label>
            Microservice:
            <input value={microserviceName} type="text" name="microservice" onInput={e => setMicroserviceName(e.target.value)} />
          </label>
          <label>
            Ім'я:
            <input value={methodName} type="text" name="name" onInput={e => setMethodName(e.target.value)} />
          </label>
          <label>
            Аргумент:
            <input value={argName} type="text" name="arg" onInput={e => setArgName(e.target.value)} />
          </label>
          <label>
            Тип:
            <input value={typeName} type="text" name="type" onInput={e => setTypeName(e.target.value)} />
          </label>
          <button onClick={addMethod}>Надіслати</button>
        </form> 
      : null }
      
      <ReactDiagram
        initDiagram={init}
        divClassName='diagram-component'
        //onModelChange={handleModelChange}
      />
    </div>
  );
}
