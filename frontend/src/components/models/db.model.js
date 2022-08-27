export const dbModel = (go, { 
  nodes, 
  links, 
  modelName,
  dbRelationship,
}) => {
  const $ = go.GraphObject.make;

  const diagram =
    $(go.Diagram,
      {
        //validCycle: go.Diagram.CycleNotDirected,  // don't allow loops
        "undoManager.isEnabled": true
      });
    
  const fieldTemplate =
    $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
      new go.Binding("portId", "name"),  // this Panel is a "port"
      {
        background: "transparent",  // so this port's background can be picked by the mouse
        fromSpot: go.Spot.Right,  // links only go from the right side to the left side
        toSpot: go.Spot.Left,
        // fromLinkable: true, toLinkable: true
      },
      new go.Binding("fromLinkable", "type", (type) => (type === 'pk' || type === 'fk') ? true : true),
      new go.Binding("toLinkable", "type", (type) => (type === 'pk' || type === 'fk') ? true : true),
      $(go.Shape,
        {
          column: 0,
          width: 12, height: 12, margin: new go.Margin(4, 4, 4, 4),
          // but disallow drawing links from or to this shape:
          fromLinkable: false, toLinkable: false,
        },
        new go.Binding("figure", "type", (type) => (type === 'pk' || type === 'fk') ? 'Key' : 'Diamond'),
        new go.Binding("fill", "type", (type) => type === "pk" ? "#F25022" : type === "fk" ? "#00BCF2" : "#FFB900")),
      $(go.TextBlock,
        {
          column: 1,
          margin: new go.Margin(0, 10),
          stretch: go.GraphObject.Horizontal,
          font: "bold 16px sans-serif",
          wrap: go.TextBlock.None,
          overflow: go.TextBlock.OverflowEllipsis,
          // and disallow drawing links from or to this text:
          fromLinkable: false, toLinkable: false
        },
        new go.Binding("text", "name")),
      $(go.TextBlock,
        {
          column: 2,
          margin: new go.Margin(0, 10),
          stretch: go.GraphObject.Horizontal,
          font: "16px sans-serif",
          maxLines: 1,
          overflow: go.TextBlock.OverflowEllipsis,
          editable: false
        },
        new go.Binding("text", "datatype").makeTwoWay()),
    );

  function makeWidthBinding(idx) {
    function getColumnWidth(arr) {
      if (idx === 0) return 20;
      return 150;
      //if (Array.isArray(arr) && idx < arr.length) return arr[idx];
      //return NaN;
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
  diagram.nodeTemplate =
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
              font: "bold 16pt sans-serif"
            },
            new go.Binding("text", "key"))),
        $(go.Panel, "Table",
          {
            name: "TABLE", stretch: go.GraphObject.Horizontal,
            minSize: new go.Size(200, 10),
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

  const selectArrowFrom = (r) => {
    switch (r) {
      case "one-to-many": return "DoubleLine";
      case "one-to-one": return "DoubleLine";
      case "many-to-many": return "BackwardLineFork";
      default: return "DoubleLine";
    }
  }

  const selectArrowTo = (r) => {
    switch (r) {
      case "one-to-many": return "LineFork";
      case "one-to-one": return "DoubleLine";
      case "many-to-many": return "LineFork";
      default: return "LineFork";
    }
  }

  diagram.linkTemplate =
    $(go.Link,
      { relinkableFrom: true, relinkableTo: true, toShortLength: 4 },  // let user reconnect links
      $(go.Shape, { strokeWidth: 1.5 }),
      $(go.Shape, { scale: 1.5 }, new go.Binding("toArrow", "relationship", selectArrowTo)),
      $(go.Shape, { scale: 1.5 }, new go.Binding("fromArrow", "relationship", selectArrowFrom))
    );

  const checkField = (linkData) => {
    // all model changes should happen in a transaction
    diagram.commit(function(d) {
      const node_from = diagram.model.nodeDataArray.find((node) => node.key === linkData.from);
      const node_to = diagram.model.nodeDataArray.find((node) => node.key === linkData.to);
      const field_from = node_from.fields.find((field) => field.name === linkData.fromPort);
      const field_to = node_to.fields.find((field) => field.name === linkData.toPort);
      if (field_from.type === "fk" || field_from.type === "pk") {
        if (field_to.type === "fk" || field_to.type === "pk") return;
        else {
          field_to.type = "fk";
          diagram.findNodeForKey(node_to.key)?.updateTargetBindings();
        }
      } else {
        field_from.type = "fk";
        diagram.findNodeForKey(node_from.key)?.updateTargetBindings();
      }

    }, "make field foreign key");
  }

  diagram.addDiagramListener("LinkDrawn", function(e) {
    let link = e.subject;
    link.data.relationship = dbRelationship.current;
    e.diagram.model.setCategoryForLinkData(link.data, link.data.relationship);

    checkField(link.data);
  });

  diagram.model =
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

  diagram.grid.visible = true;
  diagram.toolManager.draggingTool.isGridSnapEnabled = true;
  diagram.toolManager.resizingTool.isGridSnapEnabled = true;

  return diagram;
}
