import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState, useRef, useCallback } from 'react';
import { dbFigure, keyFigure} from '../helpers/figures';
import { DbManagementBar } from './DbManagementBar';
import { MsManagementBar } from './MsManagementBar';
import { MicroservicesDiagram } from './MicroservicesDiagram';
import { DbDiagram } from './DbDiagram';

import { microservicesModel } from './models/microservices.model';
import { MainMenu } from './MainMenu';
import Header from './Header';

import './../css/main.scss';
import { nodedata, linkdata } from './../assets/data';

//const diagrams = new Map([['main', diagram]]);
const diagrams = new Map();

export function MainComponent() {
  const [nodes, setNodes] = useState(nodedata);
  const [links, setLinks] = useState(linkdata);
  const [moleculerOptions, setMoleculerOptions] = useState({});

  let globalDiagram = useRef('');

  const [isFormDisplayed, setFormDisplay] = useState(false);
  const [metadataToggle, setMetadataToggle] = useState(false);

  const [currentModel, setCurrentModel] = useState('main');
  const [metadata, setMetadata] = useState({});

  const diagramData = {
    nodes, setNodes, links, setLinks, isFormDisplayed, setFormDisplay, metadata, setMetadata
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

  return (
    <div>
      <Header></Header>
      <div className="main">
        <MainMenu 
          saveSchemeHandler={saveSchemeHandler} 
          moleculerOptions={moleculerOptions} 
          setMoleculerOptions={setMoleculerOptions}
        ></MainMenu>
        { currentModel === 'main' ? 
          <MicroservicesDiagram 
            diagram={globalDiagram}
            microserviceName={microserviceName}
            currentModel={currentModel}
            arrowType={arrowType}
            metadataToggle={metadataToggle} 
            setMetadataToggle={() => setMetadataToggle(false)}
            init={() => init(currentModel)}
            { ...diagramData }
          />
          : 
          <DbDiagram 
            globalDiagram={globalDiagram}
            currentModel={currentModel}
            setCurrentModel={setCurrentModel}
            init={() => init(currentModel)}
            dbRelationship={dbRelationship}
            { ...diagramData }
          />
          }
      </div>
    </div>
  );
}
