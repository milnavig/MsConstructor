import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState } from 'react';

let myDiagram;

function init() {
  const $ = go.GraphObject.make;

  myDiagram =
    $(go.Diagram,
      {
        layout: $(go.TreeLayout,  // the layout for the entire diagram
          {
            angle: 90,
            arrangement: go.TreeLayout.ArrangementHorizontal,
            isRealtime: false
          })
      });

  // define the node template for non-groups
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "Rectangle",
        { stroke: null, strokeWidth: 0 },
        new go.Binding("fill", "color")),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Left },
        $(go.Shape,  
          { width: 4, height: 4, portId: "In", toSpot: go.Spot.Right,
            toLinkable: true })),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Right },
        $(go.Shape,  // the "Out" port
          { width: 4, height: 4, portId: "Out", fromSpot: go.Spot.Right,
            fromLinkable: true })),
      $(go.TextBlock,
        { margin: 7, font: "Bold 14px Sans-Serif", margin: 20 },
        //the text, color, and key are all bound to the same property in the node data
        new go.Binding("text", "key"))
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

  function convertToArrow(r) {
    console.log(r)
    console.log('Hi')
    switch (r) {
      case "generalization": return "Triangle";
      case "aggregation": return "StretchedDiamond";
      default: return "Triangle";
    }
  }
  
  myDiagram.linkTemplate =
    $(go.Link,
      // { routing: go.Link.Orthogonal, corner: 10 },
      //new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
      $(go.Shape, { strokeWidth: 2 }),
      //$(go.Shape, { scale: 1.3, fill: "white" },
      //  new go.Binding("fromArrow", "relationship", convertFromArrow)),
      $(go.Shape, { fill: "white" },
        new go.Binding("toArrow", "relationship", convertToArrow))
    );

  // define the group template
  myDiagram.groupTemplate =
    $(go.Group, "Auto",
      { // define the group's internal layout
        layout: $(go.TreeLayout,
          { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false }),
        // the group begins unexpanded;
        // upon expansion, a Diagram Listener will generate contents for the group
        isSubGraphExpanded: false,
        // when a group is expanded, if it contains no parts, generate a subGraph inside of it
        subGraphExpandedChanged: group => {
          if (group.memberParts.count === 0) {
            //randomGroup(group.data.key);
          }
        }
      },
      $(go.Shape, "Rectangle",
        { fill: null, stroke: "gray", strokeWidth: 2 }),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Left },
        $(go.Shape,  
          { width: 6, height: 6, portId: "In", toSpot: go.Spot.Left,
            toLinkable: true })),
        $(go.TextBlock, "In"),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Right },
        $(go.TextBlock, "Out"),  // "Out" port label
        $(go.Shape,  // the "Out" port
          { width: 6, height: 6, portId: "Out", fromSpot: go.Spot.Right,
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

  // generate the initial model
  randomGroup();
  
  var nodedata = [
    { key: 'microservice-1', isGroup: true },
    { key: 'microservice-2', isGroup: true },
    { key: 'func1', group: 'microservice-1', color: go.Brush.randomColor() },
    { key: 'func2', group: 'microservice-1', color: go.Brush.randomColor() },
    { key: 'func3', group: 'microservice-2', color: go.Brush.randomColor() },
  ];
  var linkdata = [
    { from: 'microservice-1', to: 'microservice-2', relationship: 'generalization' },
    { from: 'func1', to: 'func2', relationship: 'generalization' }
  ];
  myDiagram.model = new go.GraphLinksModel({
      copiesArrays: true,
      copiesArrayObjects: true,
      nodeDataArray: nodedata,
      linkDataArray: linkdata
  });

  // notice whenever a transaction or undo/redo has occurred
  myDiagram.addModelChangedListener(function(evt) {
    //if (evt.xr === 'linkDataArray') evt.Bo.relationship = 'generalization';
  });

  myDiagram.addDiagramListener("LinkDrawn", function(e) {
    var link = e.subject;
    //console.log(link.data);
    link.data.relationship = 'generalization';
    e.diagram.model.setCategoryForLinkData(link.data, 'generalization');
    //link.data.relationship = 'generalization';

    const tool = myDiagram.toolManager.linkingTool;
    console.log(tool.archetypeLinkData);
    // log model
    var modelAsText = myDiagram.model.toJson();
    console.log(modelAsText);
  });


  return myDiagram;
}

// Generate a random number of nodes, including groups.
// If a group's key is given as a parameter, put these nodes inside it
function randomGroup(group) {
  // all modification to the diagram is within this transaction
  myDiagram.startTransaction("addGroupContents");
  var addedKeys = [];  // this will contain the keys of all nodes created
  var groupCount = 0;  // the number of groups in the diagram, to determine the numbers in the keys of new groups
  myDiagram.nodes.each(node => {
    if (node instanceof go.Group) groupCount++;
  });
  // create a random number of groups
  // ensure there are at least 10 groups in the diagram
  var groups = Math.floor(Math.random() * 2);
  if (groupCount < 10) groups += 1;
  for (var i = 0; i < groups; i++) {
    var name = "group" + (i + groupCount);
    myDiagram.model.addNodeData({ key: name, isGroup: true, group: group });
    addedKeys.push(name);
  }
  var nodes = Math.floor(Math.random() * 3) + 2;
  // create a random number of non-group nodes
  for (var i = 0; i < nodes; i++) {
    var color = go.Brush.randomColor();
    // make sure the color, which will be the node's key, is unique in the diagram before adding the new node
    if (myDiagram.findPartForKey(color) === null) {
      myDiagram.model.addNodeData({ key: color, group: group });
      addedKeys.push(color);
    }
  }
  // add at least one link from each node to another
  // this could result in clusters of nodes unreachable from each other, but no lone nodes
  var arr = [];
  for (var x in addedKeys) arr.push(addedKeys[x]);
  arr.sort((x, y) => Math.random(2) - 1);
  for (var i = 0; i < arr.length; i++) {
    var from = Math.floor(Math.random() * (arr.length - i)) + i;
    if (from !== i) {
      myDiagram.model.addLinkData({ from: arr[from], to: arr[i] });
    }
  }
  myDiagram.commitTransaction("addGroupContents");
}

export function MicroservicesDiagram() {
  return (
    <div>
      <ReactDiagram
        initDiagram={init}
        divClassName='diagram-component'
        //onModelChange={handleModelChange}
      />
    </div>
  );
}
