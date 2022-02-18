import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState, useRef, useCallback } from 'react';
import { dbFigure, keyFigure} from './../helpers/figures';
import { DbManagementBar } from './DbManagementBar';

let myDiagram;

let nodedata = {
  main: [
    { key: 'microservice-1', isGroup: true },
    { key: 'microservice-2', isGroup: true },
    { key: 'func1', group: 'microservice-1', color: go.Brush.randomColor(), type: "method", parameters: [{ name: "amount", type: "Currency" }] },
    { key: 'func2', group: 'microservice-1', color: go.Brush.randomColor(), type: "method", parameters: [{ name: "amount", type: "Currency" }] },
    { key: 'func3', group: 'microservice-2', color: go.Brush.randomColor(), type: "method", parameters: [{ name: "amount", type: "Currency" }] },
    { key: 'db1', name: 'db1', type: "db", category: 'db'},
  ], 
  db1: [
    {
      key: "Record1",
      widths: [NaN, NaN, 60],
      fields: [
        { name: "field1", info: "first field", type: "pk" },
        { name: "field2", info: "the second one", type: "fk" },
        { name: "fieldThree", info: "3rd", type: "figure" }
      ],
      loc: "0 0"
    },
    {
      key: "Record2",
      widths: [NaN, NaN, NaN],
      fields: [
        { name: "fieldA", info: "", type: "pk" },
        { name: "fieldB", info: "", type: "fk" },
        { name: "fieldC", info: "", type: "field" },
        { name: "fieldD", info: "fourth", type: "field" }
      ],
      loc: "250 0"
    },
    {
      key: "Record3",
      widths: [NaN, NaN, NaN],
      fields: [
        { name: "field3", info: "", type: "pk" },
        { name: "field4", info: "", type: "fk" },
        { name: "field5", info: "", type: "field" },
        { name: "field6", info: "fourth", type: "field" }
      ],
      loc: "250 150"
    }
  ],
};
let linkdata = {
  main: [
    { from: 'microservice-1', to: 'microservice-2', relationship: 'event', fromPort: "In", toPort: "Out", },
    { from: 'func1', to: 'func3', relationship: 'rpc', portId: "In" },
  ],
  db1: [
    { from: "Record1", fromPort: "field1", to: "Record2", toPort: "fieldA" },
    { from: "Record1", fromPort: "field2", to: "Record2", toPort: "fieldD" },
    { from: "Record1", fromPort: "fieldThree", to: "Record2", toPort: "fieldB" }
  ],
};

const diagrams = new Map([['main', myDiagram]]);

function createModel(nodes, links, modelName) {
  const $ = go.GraphObject.make;

  const myDiagram =
    $(go.Diagram,
      {
        //validCycle: go.Diagram.CycleNotDirected,  // don't allow loops
        "undoManager.isEnabled": true
      });
    
  var fieldTemplate =
    $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
      new go.Binding("portId", "name"),  // this Panel is a "port"
      {
        background: "transparent",  // so this port's background can be picked by the mouse
        fromSpot: go.Spot.Right,  // links only go from the right side to the left side
        toSpot: go.Spot.Left,
        // allow drawing links from or to this port:
        //fromLinkable: true, toLinkable: true
      },
      new go.Binding("fromLinkable", "type", (type) => (type === 'pk' || type === 'fk') ? true : false),
      new go.Binding("toLinkable", "type", (type) => (type === 'pk' || type === 'fk') ? true : false),
      $(go.Shape,
        {
          column: 0,
          width: 12, height: 12, margin: 4,
          // but disallow drawing links from or to this shape:
          fromLinkable: false, toLinkable: false,
        },
        new go.Binding("figure", "type", (type) => (type === 'pk' || type === 'fk') ? 'Key' : 'Diamond'),
        new go.Binding("fill", "type", (type) => type === "pk" ? "#F25022" : type === "fk" ? "#00BCF2" : "#FFB900")),
      $(go.TextBlock,
        {
          column: 1,
          margin: new go.Margin(0, 2),
          stretch: go.GraphObject.Horizontal,
          font: "bold 13px sans-serif",
          wrap: go.TextBlock.None,
          overflow: go.TextBlock.OverflowEllipsis,
          // and disallow drawing links from or to this text:
          fromLinkable: false, toLinkable: false
        },
        new go.Binding("text", "name")),
      $(go.TextBlock,
        {
          column: 2,
          margin: new go.Margin(0, 2),
          stretch: go.GraphObject.Horizontal,
          font: "13px sans-serif",
          maxLines: 3,
          overflow: go.TextBlock.OverflowEllipsis,
          editable: true
        },
        new go.Binding("text", "datatype").makeTwoWay()),
    );

  function makeWidthBinding(idx) {
    function getColumnWidth(arr) {
      if (Array.isArray(arr) && idx < arr.length) return arr[idx];
      return NaN;
    }
    // This target-to-source conversion sets a number in the Array at the given index.
    function setColumnWidth(w, data) {
      var arr = data.widths;
      if (!arr) arr = [];
      if (idx >= arr.length) {
        for (var i = arr.length; i <= idx; i++) arr[i] = NaN;  // default to NaN
      }
      arr[idx] = w;
      return arr; // need to return the Array (as the value of data.widths)
    }
    return [
      { column: idx },
      new go.Binding("width", "widths", getColumnWidth).makeTwoWay(setColumnWidth)
    ]
  }

  // This template represents a whole "record".
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      { 
        //fromSpot: go.Spot.RightSide, //go.Spot.AllSides
        //toSpot: go.Spot.LeftSide,
        //fromLinkable: true, toLinkable: true,
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      // this rectangular shape surrounds the content of the node
      $(go.Shape,
        { 
          fill: "#EEEEEE",
        }),
      // the content consists of a header and a list of items
      $(go.Panel, "Vertical",
        { stretch: go.GraphObject.Horizontal, alignment: go.Spot.TopLeft },
        // this is the header for the whole node
        $(go.Panel, "Auto",
          { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
          $(go.Shape,
            { fill: "#1570A6", stroke: null }),
          $(go.TextBlock,
            {
              alignment: go.Spot.Center,
              margin: 3,
              stroke: "white",
              textAlign: "center",
              font: "bold 12pt sans-serif"
            },
            new go.Binding("text", "key"))),
        $(go.Panel, "Table",
          {
            name: "TABLE", stretch: go.GraphObject.Horizontal,
            minSize: new go.Size(100, 10),
            defaultAlignment: go.Spot.Left,
            defaultStretch: go.GraphObject.Horizontal,
            defaultColumnSeparatorStroke: "gray",
            defaultRowSeparatorStroke: "gray",
            itemTemplate: fieldTemplate
          },
          $(go.RowColumnDefinition, makeWidthBinding(0)),
          $(go.RowColumnDefinition, makeWidthBinding(1)),
          $(go.RowColumnDefinition, makeWidthBinding(2)),
          new go.Binding("itemArray", "fields")
        ) 
      ) 
    ); 

  myDiagram.linkTemplate =
    $(go.Link,
      { relinkableFrom: true, relinkableTo: true, toShortLength: 4 },  // let user reconnect links
      $(go.Shape, { strokeWidth: 1.5 }),
      $(go.Shape, { toArrow: "LineFork", scale: 1.5 }),
      $(go.Shape, { fromArrow: "DoubleLine", scale: 1.5 })
    );

  myDiagram.addDiagramListener("LinkDrawn", function(e) {
    //
  });

  myDiagram.model =
    new go.GraphLinksModel(
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        // automatically update the model that is shown on this page
        "Changed": function(e) {
          
        },
        nodeDataArray: nodes[modelName] ?? [],
        linkDataArray: links[modelName] ?? []
      });

  return myDiagram;
}

export function MicroservicesDiagramV3() {
  const [nodes, setNodes] = useState(nodedata);
  const [links, setLinks] = useState(linkdata);
  const [showForm, setShowForm] = useState(false);

  const [microserviceName, setMicroserviceName] = useState('');
  const [methodName, setMethodName] = useState('');
  const [argName, setArgName] = useState('');
  const [typeName, setTypeName] = useState('');

  //const modelName = useRef('main')
  const [currentModel, setCurrentModel] = useState('main');

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const arrowType = useRef('event');

  function addMethod(e) {
    e.preventDefault();
    setNodes([...nodes, {
      key: methodName, group: microserviceName, color: go.Brush.randomColor(), type: "method", parameters: [{ name: argName, type: typeName }]
    }]);
    myDiagram.model.addNodeData({
      key: methodName, group: microserviceName, color: go.Brush.randomColor(), type: "method", parameters: [{ name: argName, type: typeName }]
    })
    console.log(nodes);
  }

  function addTable(e, data) {
    e.preventDefault();

    const table = {
      key: data.name,
      widths: [NaN, NaN, 60],
      fields: data.fields.map(d => ({ name: d.name, datatype: d.type, info: "first field", type: d.pk ? "pk" : "field" })),
      loc: "0 0"
    };
    setNodes(
      {...nodes, [currentModel]: [...nodes[currentModel], table]});
    myDiagram.model.addNodeData(table);
  }

  function displayScheme(e, obj) {
    let model = diagrams.get(obj.part.data.key);
    if (!model) {
      setNodes({...nodes, [obj.part.data.key]: []});
      setLinks({...links, [obj.part.data.key]: []});
      model = createModel(nodes, links, obj.part.data.key);
      diagrams.set(obj.part.data.key, model);
    }
    setCurrentModel(obj.part.data.key);
    myDiagram = model;
    forceUpdate();
  }

  function init(modelName) {
    if (modelName !== 'main') {
      return diagrams.get(modelName);
    }

    const $ = go.GraphObject.make;

    go.Shape.defineFigureGenerator("Database", dbFigure);
    go.Shape.defineFigureGenerator("Key", keyFigure);

    go.Shape.defineArrowheadGeometry("DoubleLine", "m 0,0 l 0,8 m 2,0 l 0,-8");
    go.Shape.defineArrowheadGeometry("LineFork", "m 0,0 l 0,8 m 0,-4 l 8,0 m -8,0 l 8,-4 m -8,4 l 8,4");
  
    myDiagram =
      $(go.Diagram,
        {
          initialContentAlignment: go.Spot.Center,  
        });
    
    // define the node template for non-groups
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        { 
          fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide,
          //minLocation: new go.Point(NaN, NaN),  // disallow movement
          //maxLocation: new go.Point(NaN, NaN) 
        },
        new go.Binding("minLocation", "type", (t) => t === "method" ? new go.Point(NaN, NaN) : null),
        new go.Binding("maxLocation", "type", (t) => t === "method" ? new go.Point(NaN, NaN) : null),
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
        $(go.Panel, "Horizontal",
          { margin: 20 },
          // method name, underlined if scope=="class" to indicate static method
          $(go.TextBlock,
            { isMultiline: false, editable: true },
            new go.Binding("text", "key").makeTwoWay(),
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

    var dbtemplate =
      $(go.Node, "Auto",
        { toSpot: go.Spot.TopSide,
          contextMenu:     // define a context menu for each node
          $("ContextMenu",  // that has one button
            $("ContextMenuButton",
              {
                "ButtonBorder.fill": "white",
                "_buttonFillOver": "skyblue"
              },
              $(go.TextBlock, "Show scheme"),
              { click: displayScheme }),
          ),
        },
        $(go.Shape, "Database", {
          fill: '#fff'
        }),
        $(go.Panel, "Horizontal",
          { alignment: go.Spot.Top },
          $(go.Shape,  
            { width: 0, height: 0, portId: "In", toSpot: go.Spot.TopSide,
              toLinkable: true })),
        $(go.Panel, "Horizontal",
          $(go.TextBlock, { font: "bold 12pt sans-serif", margin: 10 },
            new go.Binding("text", "name")),
        )
      );

    let templmap = new go.Map();
    templmap.add("db", dbtemplate);
    templmap.add("", myDiagram.nodeTemplate);

    myDiagram.nodeTemplateMap = templmap;
  
    function makeLayout(horiz) {  // a Binding conversion function
      return new go.GridLayout(
        {
          wrappingColumn: 1, alignment: go.GridLayout.Position,
          cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
        });
    }
  
    function convertToArrow(r) {
      switch (r) {
        case "event": return "Standard";
        case "rpc": return "Feather";
        default: return "Triangle";
      }
    }

    function convertToLink(r) {
      switch (r) {
        case "event": return [5, 10];
        case "db": return [5, 2];
        case "rpc": return null;
        default: return null;
      }
    }
    
    myDiagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.Orthogonal, corner: 5 },
        $(go.Shape, { strokeWidth: 2, /*strokeDashArray: [5, 10]*/ },
          new go.Binding("strokeDashArray", "relationship", convertToLink)), 
        //$(go.Shape, { scale: 1.3, fill: "white" },
        //  new go.Binding("fromArrow", "relationship", convertFromArrow)),
        $(go.Shape, { fill: "white" },
          new go.Binding("toArrow", "relationship", convertToArrow))
      );
  
    function displayForm(e, obj) {
      setMicroserviceName(obj.part.data.key);
      setShowForm(true);
    }

    function addDB(e, obj) {
      setMicroserviceName(obj.part.data.key);
      setShowForm(true);

      const db = 'db2';

      setNodes({...nodes, [currentModel]: [...nodes[currentModel], {
        key: db, name: db, type: "db", category: 'db'
      }]});
      myDiagram.model.addNodeData({key: db, name: db, type: "db", category: 'db'});

      setLinks({...links, [currentModel]: [...links[currentModel], { from: obj.part.data.key, to: db, relationship: 'db' }]});
      myDiagram.model.addLinkData({ from: obj.part.data.key, to: db, relationship: 'db' });
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
                { click: displayForm }),
              $("ContextMenuButton",
                {
                  "ButtonBorder.fill": "white",
                  "_buttonFillOver": "skyblue"
                },
                $(go.TextBlock, "Add db"),
                { click: addDB })
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
          layout: makeLayout(false),
          fromSpot: go.Spot.RightSide, 
          toSpot: go.Spot.LeftSide,
          //computesBoundsAfterDrag: true
        },
        $(go.Shape, "Rectangle",
          { fill: null, stroke: "gray", strokeWidth: 2}),
        $(go.Panel, "Horizontal",
          { alignment: go.Spot.Left },
          $(go.Shape,  
            { width: 6, height: 6, portId: "In", toSpot: go.Spot.LeftSide,
              toLinkable: true })),
        $(go.Panel, "Horizontal",
          { alignment: go.Spot.Right },
          $(go.Shape,  // the "Out" port
            { width: 6, height: 6, portId: "Out", fromSpot: go.Spot.RightSide,
              fromLinkable: true })),
        $(go.Panel, "Vertical",
          { defaultAlignment: go.Spot.Left, margin: 4 },
          $(go.Panel, "Horizontal",
            { defaultAlignment: go.Spot.Top },
            // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
            $("SubGraphExpanderButton", { margin: 6 }),
            $(go.TextBlock,
              { font: "Bold 18px Sans-Serif", margin: 6 },
              new go.Binding("text", "key"))
          ),
          // create a placeholder to represent the area where the contents of the group are
          $(go.Placeholder,
            { padding: new go.Margin(0, 15) })
        )  // end Vertical Panel
      );  // end Group
    
    myDiagram.model = new go.GraphLinksModel({
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: nodes.main,
        linkDataArray: links.main
    });
  
    // notice whenever a transaction or undo/redo has occurred
    myDiagram.addModelChangedListener(function(evt) {
      //if (evt.xr === 'linkDataArray') evt.Bo.relationship = 'generalization';
    });
  
    myDiagram.addDiagramListener("LinkDrawn", function(e) {
      let link = e.subject;
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
      <button onClick={(e) => arrowType.current = 'event'}>event</button>
      <button onClick={(e) => arrowType.current = 'rpc'}>rpc</button>
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
      <DbManagementBar currentModel={currentModel} addTable={addTable}></DbManagementBar>
      { currentModel === 'main' ? 
        <ReactDiagram
          initDiagram={() => init(currentModel)}
          divClassName='diagram-component'
          //onModelChange={handleModelChange}
        /> 
        : 
        <div>
          <button onClick={(e) => setCurrentModel('main')}>Back</button>
          <ReactDiagram
            initDiagram={() => init(currentModel)}
            divClassName='diagram-component'
          />
        </div> }
    </div>
  );
}
