import { dbModel } from './db.model';

export const microservicesModel = (go, { 
  nodes, 
  links, 
  setLinks, 
  setNodes, 
  changeDiagram, 
  currentModel, 
  setCurrentModel, 
  diagrams, 
  forceUpdate, 
  arrowType, 
  dbRelationship,
  invokePopup,
  openMetadata,
  setEventToggle,
  setCurrentLink,
}) => {
  const $ = go.GraphObject.make;

  const diagram =
    $(go.Diagram,
      {
        initialContentAlignment: go.Spot.Center,  
      });
  
  // define the node template for non-groups
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { 
        fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide,
        //minLocation: new go.Point(NaN, NaN),  // disallow movement
        //maxLocation: new go.Point(NaN, NaN) 
      },
      new go.Binding("minLocation", "type", (t) => t === "method" ? new go.Point(NaN, NaN) : null),
      new go.Binding("maxLocation", "type", (t) => t === "method" ? new go.Point(NaN, NaN) : null),
      $(go.Shape, "Rectangle",
        { fill: "#EEEEEE", stroke: null, strokeWidth: 0, width: 300 },
      ),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Left },
        $(go.Shape,  
          { width: 4, height: 4, toSpot: go.Spot.LeftSide,
            toLinkable: true }, new go.Binding("portId", "group", (id) => id + "_in"))),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Right },
        $(go.Shape,  // the "Out" port
          { width: 4, height: 4, fromSpot: go.Spot.RightSide,
            fromLinkable: true }, new go.Binding("portId", "group", (id) => id + "_out"))),
      $(go.Panel, "Horizontal",
        { margin: 10 },
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
      ),
    );

  const vartemplate =
    $(go.Node, "Auto",
      { 
        fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide,
        //minLocation: new go.Point(NaN, NaN),  // disallow movement
        //maxLocation: new go.Point(NaN, NaN) 
      },
      new go.Binding("minLocation", "type", (t) => t === "variable" ? new go.Point(NaN, NaN) : null),
      new go.Binding("maxLocation", "type", (t) => t === "variable" ? new go.Point(NaN, NaN) : null),
      $(go.Shape, "Rectangle",
        { fill: "#b8c4db", stroke: null, strokeWidth: 0, width: 300 },
      ),
      $(go.Panel, "Horizontal",
        { margin: 10 },
        // method name, underlined if scope=="class" to indicate static method
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding("text", "key").makeTwoWay(),
        ),
      ),
    );

  const apitemplate =
    $(go.Node, "Auto",
      { 
        fromSpot: go.Spot.RightSide,
      },
      new go.Binding("minLocation", "type", (t) => t === "endpoint" ? new go.Point(NaN, NaN) : null),
      new go.Binding("maxLocation", "type", (t) => t === "endpoint" ? new go.Point(NaN, NaN) : null),
      $(go.Shape, "Rectangle",
        { fill: "#EEEEEE", stroke: null, strokeWidth: 0, width: 250 },
      ),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Left },
      ),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Right },
        $(go.Shape,  // the "Out" port
          { width: 4, height: 4, portId: "Out", fromSpot: go.Spot.RightSide,
            fromLinkable: true })),
      $(go.Panel, "Horizontal",
        { margin: 10 },
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding("text", "http_method").makeTwoWay(),
        ),
        $(go.TextBlock, " "),
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding("text", "url").makeTwoWay())
      ),
    );

  const dbtemplate =
    $(go.Node, "Auto",
      { toSpot: go.Spot.TopSide,
        contextMenu:     // define a context menu for each node
        $("ContextMenu",  // that has one button
          $("ContextMenuButton",
            {
              "ButtonBorder.fill": "white",
              "_buttonFillOver": "skyblue"
            },
            $(go.TextBlock, {font: "16px sans-serif"}, "Показати схему"),
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

  function makeLayout() {  // a Binding conversion function
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
      case "api": return [5, 0];
      case "rpc": return null;
      default: return null;
    }
  }

  function convertToWidth(r) {
    switch (r) {
      case "event": return 2;
      case "db": return 2;
      case "api": return 3;
      case "rpc": return 2;
      default: return 2;
    }
  }
  
  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal, corner: 5, reshapable: true },
      $(go.Shape, // { strokeWidth: 2 },
        new go.Binding("strokeWidth", "relationship", convertToWidth), 
        new go.Binding("strokeDashArray", "relationship", convertToLink)), 
      //$(go.Shape, { scale: 1.3, fill: "white" },
      //  new go.Binding("fromArrow", "relationship", convertFromArrow)),
      $(go.Shape, { fill: "white" },
        new go.Binding("toArrow", "relationship", convertToArrow)),
      $(go.TextBlock, { textAlign: "center", segmentOffset: new go.Point(0, -10),
        segmentOrientation: go.Link.OrientUpright },  // centered multi-line text
        new go.Binding("text", "eventName", (e) => e ?? ""))
    );

  function handleAddMethod(e, obj) {
    //setMicroserviceName(obj.part.data.key);
    //setShowForm(true);
    invokePopup(obj.part.data.key, "method");
  }

  function handleAddVariable(e, obj) {
    invokePopup(obj.part.data.key, "variable");
  }

  function handleAddDB(e, obj) {
    const microservice = obj.part.data.key;
    //setShowForm(true); // don't know why I added it

    const db = `${obj.part.data.key}_db`;

    setNodes({...nodes, [currentModel]: [...nodes[currentModel], {
      key: db, name: db, type: "db", category: "db"
    }]});
    diagram.model.addNodeData({key: db, name: db, type: "db", category: "db"});

    setLinks({...links, [currentModel]: [...links[currentModel], { from: microservice, to: db, relationship: "db" }]});
    diagram.model.addLinkData({ from: microservice, to: db, relationship: "db" });
  }

  function handleAddMetadata(e, obj) {
    const microservice = obj.part.data.key;
    openMetadata(microservice);
  }

  function displayScheme(e, obj) {
    let diagram = diagrams.get(obj.part.data.key);
    if (!diagram) {
      setNodes({...nodes, [obj.part.data.key]: []});
      setLinks({...links, [obj.part.data.key]: []});
      diagram = dbModel(go, {nodes, links, modelName: obj.part.data.key, dbRelationship});
      diagrams.set(obj.part.data.key, diagram);
    }
    setCurrentModel(obj.part.data.key);
    changeDiagram(diagram);
    forceUpdate();
  }

  // define the group template
  diagram.groupTemplate =
    $(go.Group, "Auto",
      { // define the group's internal layout
        contextMenu:     // define a context menu for each node
          $("ContextMenu",  // that has one button
            $("ContextMenuButton",
              {
                "ButtonBorder.fill": "white",
                "_buttonFillOver": "skyblue"
              },
              $(go.TextBlock, {font: "16px sans-serif"}, "Додати метод"),
              { click: handleAddMethod }),
            $("ContextMenuButton",
              {
                "ButtonBorder.fill": "white",
                "_buttonFillOver": "skyblue"
              },
              $(go.TextBlock, {font: "16px sans-serif"}, "Додати властивість"),
              { click: handleAddVariable }),
            $("ContextMenuButton",
              {
                "ButtonBorder.fill": "white",
                "_buttonFillOver": "skyblue"
              },
              $(go.TextBlock, {font: "16px sans-serif"}, "Додати базу даних"),
              { click: handleAddDB }),
            $("ContextMenuButton",
              {
                "ButtonBorder.fill": "white",
                "_buttonFillOver": "skyblue"
              },
              $(go.TextBlock, {font: "16px sans-serif"}, "Додати метадані"),
              { click: handleAddMetadata })
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
        layout: makeLayout(),
        fromSpot: go.Spot.RightSide, 
        toSpot: go.Spot.LeftSide,
        //computesBoundsAfterDrag: true,
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Rectangle",
        { fill: "#fff", stroke: "gray", strokeWidth: 2 }),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Left },
        $(go.Shape,  
          { width: 6, height: 6, toSpot: go.Spot.LeftSide,
            toLinkable: true }, new go.Binding("portId", "key", (id) => id + "_in"))),
      $(go.Panel, "Horizontal",
        { alignment: go.Spot.Right },
        $(go.Shape,  // the "Out" port
          { width: 6, height: 6, fromSpot: go.Spot.RightSide,
            fromLinkable: true }, new go.Binding("portId", "key", (id) => id + "_out"))),
      $(go.Panel, "Vertical",
        { defaultAlignment: go.Spot.Left, margin: 10, /*padding: 200*/ },
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
  
  const gtwtemplate = $(go.Group, "Auto",
    { // define the group's internal layout
      // the group begins unexpanded;
      // upon expansion, a Diagram Listener will generate contents for the group
      isSubGraphExpanded: false,
      // when a group is expanded, if it contains no parts, generate a subGraph inside of it
      subGraphExpandedChanged: group => {
        if (group.memberParts.count === 0) {
          //randomGroup(group.data.key);
        }
      },
      layout: makeLayout(),
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, "Rectangle",
      { fill: "#fff", stroke: "gray", strokeWidth: 2 }),
    $(go.Panel, "Vertical",
      { defaultAlignment: go.Spot.Left, margin: 10, /*padding: 200*/ },
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
  
  const nodetemplmap = new go.Map();
  nodetemplmap.add("db", dbtemplate);
  nodetemplmap.add("api", apitemplate);
  nodetemplmap.add("variable", vartemplate);
  nodetemplmap.add("", diagram.nodeTemplate);

  diagram.nodeTemplateMap = nodetemplmap;

  const grouptemplmap = new go.Map();
  grouptemplmap.add("gateway", gtwtemplate);
  grouptemplmap.add("", diagram.groupTemplate);

  diagram.groupTemplateMap = grouptemplmap;
  
  diagram.model = new go.GraphLinksModel({
    copiesArrays: true,
    copiesArrayObjects: true,
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    linkKeyProperty: "id",
    nodeDataArray: nodes.main,
    linkDataArray: links.main,
  });

  // notice whenever a transaction or undo/redo has occurred
  // diagram.addModelChangedListener(function(evt) {
  //  
  // });

  diagram.addDiagramListener("LinkDrawn", function(e) {
    let link = e.subject;
    link.data.relationship = arrowType.current;

    if (link.data.from.startsWith("endpoint")) {
      if (diagram.findNodeForKey(link.data.to)?.data.type === "microservice") {
        e.diagram.remove(link);
      }
      link.data.relationship = "api";
      e.diagram.model.setCategoryForLinkData(link.data, link.data.relationship);
      return;
    }

    if (link.data.relationship === "event") {
      link.data.eventName = "";
      setEventToggle(true);
      setCurrentLink(link.data);
    }

    e.diagram.model.setCategoryForLinkData(link.data, link.data.relationship);

    //const tool = diagram.toolManager.linkingTool;
    //console.log(tool.archetypeLinkData);
    // log model
    //var modelAsText = diagram.model.toJson();
    //console.log(modelAsText);
  });

  diagram.grid.visible = true;
  diagram.toolManager.draggingTool.isGridSnapEnabled = true;
  diagram.toolManager.resizingTool.isGridSnapEnabled = true;

  return diagram;
}
