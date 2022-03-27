import * as go from 'gojs';
import { useState, useRef, useCallback, useEffect } from 'react';
import { dbFigure, keyFigure} from '../helpers/figures';
import { MicroservicesDiagram } from './MicroservicesDiagram';
import { DbDiagram } from './DbDiagram';

import { microservicesModel } from './models/microservices.model';
import { MainMenu } from './MainMenu';
import Header from './Header';

import './../css/main.scss';
import { nodedata_basic, linkdata_basic } from './../assets/data';
import test_data from './../assets/test_data.json';
import { dbModel } from './models/db.model';

const diagrams = new Map();

export function MainComponent() {
  const [nodes, setNodes] = useState(nodedata_basic);
  const [links, setLinks] = useState(linkdata_basic);
  const [moleculerOptions, setMoleculerOptions] = useState({});

  let globalDiagram = useRef('');

  const [isFormDisplayed, setFormDisplay] = useState(false);
  const [metadataToggle, setMetadataToggle] = useState(false);
  const [eventToggle, setEventToggle] = useState(false);
  const [currentLink, setCurrentLink] = useState({});

  const [currentModel, setCurrentModel] = useState('main');
  const [metadata, setMetadata] = useState({});

  const diagramData = {
    nodes, setNodes, links, setLinks, isFormDisplayed, setFormDisplay, metadata, setMetadata, eventToggle, setEventToggle, currentLink, setCurrentLink,
  };

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const arrowType = useRef('event');
  const dbRelationship = useRef('one-to-many');
  const microserviceName = useRef('');

  const invokePopup = (msName) => {
    microserviceName.current = msName;
    setFormDisplay(true);
  }

  const data = {
    globalDiagram, 
    setFormDisplay, 
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
    eventToggle, 
    setEventToggle,
    currentLink, 
    setCurrentLink,
  };

  function changeDiagram(new_diagram) {
    globalDiagram.current = new_diagram;
  }

  function init(modelName) {
    if (modelName !== 'main') {
      return diagrams.get(modelName);
    }

    go.Shape.defineFigureGenerator("Database", dbFigure);
    go.Shape.defineFigureGenerator("Key", keyFigure);

    go.Shape.defineArrowheadGeometry("DoubleLine", "m 0,0 l 0,8 m 2,0 l 0,-8");
    go.Shape.defineArrowheadGeometry("LineFork", "m 0,0 l 0,8 m 0,-4 l 8,0 m -8,0 l 8,-4 m -8,4 l 8,4");
  
    const diagram = microservicesModel(go, data);
    globalDiagram.current = diagram;
    diagrams.set('main', diagram);

    return diagram;
  }

  function saveSchemeHandler() {
    const scheme = {};
    diagrams.forEach((d, key) => {
      //scheme[key] = d.model.modelData;
      scheme[key] = d.model.toJson(); //JSON.stringify(d.model, null, 2);
    });
    scheme.options = moleculerOptions;
    console.log(scheme);

    download(JSON.stringify(scheme, null, 2));
  }

  function download(data, filename = "scheme.json", type = "json") {
    let file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
      let a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
      }, 0); 
    }
  }

  function openMetadata(msName) {
    setMetadataToggle(true);
    microserviceName.current = msName;
    forceUpdate();
  }

  function setTestScheme() {
    for (let k in test_data) {
      if (k === 'main') {
        const data = go.Model.fromJson(test_data.main);
        setNodes({...nodes, [k]: data.nodeDataArray});
        setLinks({...links, [k]: data.linkDataArray});
        const main_diagram = diagrams.get('main');
        main_diagram.model = data;
      } else if (k === 'options') {
        return;
      } else {
        const data = go.Model.fromJson(test_data[k]);
        setNodes({...nodes, [k]: data.nodeDataArray});
        setLinks({...links, [k]: data.linkDataArray});

        const db = dbModel(go, {nodes: {...nodes, [k]: data.nodeDataArray}, links: {...links, [k]: data.linkDataArray}, modelName: k, dbRelationship});
        diagrams.set(k, db);
      }
    }
  }

  function openSchemeHandler() {
    const upload = document.getElementById("fileupload");
    upload.click();
    upload.onchange = function(e) { 
      let file = upload.files[0];
      let read = new FileReader();

      read.readAsBinaryString(file);
      read.onloadend = function() {
        const raw_data = JSON.parse(read.result);
        for (let k in raw_data) {
          if (k === 'main') {
            const data = go.Model.fromJson(raw_data.main);
            setNodes({...nodes, [k]: data.nodeDataArray});
            setLinks({...links, [k]: data.linkDataArray});
            const main_diagram = diagrams.get('main');
            //main_diagram.clear();
            //main_diagram.currentTool.doCancel();
            //main_diagram.model = data;

            //main_diagram.startTransaction("modify nodeDataArray and linkDataArray");
            //main_diagram.model.nodeDataArray = data.nodeDataArray;
            //main_diagram.model.linkDataArray = data.linkDataArray;
            //main_diagram.commitTransaction("modify nodeDataArray and linkDataArray");

            main_diagram.startTransaction("modify nodeDataArray and linkDataArray");
            //main_diagram.clear();
            //main_diagram.currentTool.doCancel();
            main_diagram.model.mergeNodeDataArray(data.nodeDataArray);
            main_diagram.model.mergeLinkDataArray(data.linkDataArray);
            main_diagram.commitTransaction("modify nodeDataArray and linkDataArray");
          } else if (k === 'options') {
            return;
          } else {
            const data = go.Model.fromJson(raw_data[k]);
            setNodes({...nodes, [k]: data.nodeDataArray});
            setLinks({...links, [k]: data.linkDataArray});
    
            const db = dbModel(go, {nodes: {...nodes, [k]: data.nodeDataArray}, links: {...links, [k]: data.linkDataArray}, modelName: k, dbRelationship});
            diagrams.set(k, db);
          }
        }
      }
    }
  }

  function renderDiagram(currentModel) {
    if (currentModel === 'main') {
      return (<MicroservicesDiagram 
        diagram={globalDiagram}
        microserviceName={microserviceName}
        currentModel={currentModel}
        arrowType={arrowType}
        metadataToggle={metadataToggle} 
        setMetadataToggle={() => setMetadataToggle(false)}
        init={() => init(currentModel)}
        { ...diagramData }
      />);
    } else {
      return (<DbDiagram 
        globalDiagram={globalDiagram}
        currentModel={currentModel}
        setCurrentModel={setCurrentModel}
        init={() => init(currentModel)}
        dbRelationship={dbRelationship}
        { ...diagramData }
      />);
    }
  }

  function saveAppName(name) {
    setMoleculerOptions({...moleculerOptions, name});
  }

  useEffect(() => {
    //console.log(diagrams.get('main').model.toJson());
  });

  return (
    <div>
      <Header></Header>
      <div className="main">
        <MainMenu 
          saveSchemeHandler={saveSchemeHandler} 
          moleculerOptions={moleculerOptions} 
          setMoleculerOptions={setMoleculerOptions}
          setTestScheme={setTestScheme}
          openSchemeHandler={openSchemeHandler}
          saveAppName={saveAppName}
        ></MainMenu>
        { 
          renderDiagram(currentModel)
        }
      </div>
    </div>
  );
}
