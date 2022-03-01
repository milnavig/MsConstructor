import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
//import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

export function MetadataModal({isOpen, toggle, diagram, microserviceName, metadata, setMetadata}) {
  //const [metadata, setMetadata] = useState({});
  let [metaLength, setMetaLength] = useState(1);

  const addMetadata = (e) => {
    e.preventDefault();
    setMetaLength(++metaLength);
  };

  const removeMeta = (i) => {
    metadata.splice(i, 1);
    setMetadata(metadata);
    setMetaLength(--metaLength);
  }

  function saveMetadata() {
    const microservice = diagram.current.model.findNodeDataForKey(microserviceName);
    microservice.meta = microservice.meta ?? {};

    for (let key in metadata[microserviceName]) {
      const name = metadata[microserviceName][key].name;
      const value = metadata[microserviceName][key].value;
      microservice.meta[name] = value;
    }
    console.log(metadata)
    toggle(false);
  }

  return (
    <Modal 
      isOpen={isOpen}
      onClosed={toggle}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        Метадані
      </ModalHeader>
      <ModalBody>
        { 
          new Array(metaLength).fill(0).map((el, i) => <div className="metadata" key={`meta_${i}`} >
            <div className="removeButton">
              <button type="button" className="btn-close" aria-label="Delete" onClick={(e) => removeMeta(i)}></button>
            </div>
            <div>
              <TextField
                id={`name-${i}`}
                label="Властивість"
                value={metadata[microserviceName]?.[i]?.name ?? ''}
                onChange={(e) => {setMetadata({...metadata, [microserviceName]: {...metadata[microserviceName], [i]: {...(metadata[microserviceName]?.[i] ?? {}), name: e.target.value}}})}}
              />
              <TextField
                id={`value-${i}`}
                label="Значення"
                value={metadata[microserviceName]?.[i]?.value ?? ''}
                onChange={(e) => {setMetadata({...metadata, [microserviceName]: {...metadata[microserviceName], [i]: {...(metadata[microserviceName]?.[i] ?? {}), value: e.target.value}}})}}
              />
            </div>
          </div>)
        }
        <Button
          color="primary"
          onClick={(e) => {
            addMetadata(e);
          }}
          outline
          size="sm"
        >
          Додати
        </Button>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            saveMetadata();
            toggle(false);
          }}
        >
          Зберегти
        </Button>
      </ModalFooter>
    </Modal>
  );
}
