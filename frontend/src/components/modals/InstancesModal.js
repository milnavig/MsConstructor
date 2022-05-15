import { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';

export function InstancesModal({isOpen, toggle, diagram, microserviceName, instances, setInstances}) {
  let [numInstances, setNumInstances] = useState(1);

  function saveInstances() {
    const microservice = diagram.current.model.findNodeDataForKey(microserviceName);
    microservice.instances = numInstances;

    toggle(false);
  }

  return (
    <Modal 
      isOpen={isOpen}
      onClosed={toggle}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        {`Кількість екземплярів сервісу ${microserviceName}`}
      </ModalHeader>
      <ModalBody>
        <TextField
          label="Кількість екземплярів сервісу"
          type="number"
          value={numInstances}
          onChange={(e) => setNumInstances(e.target.value)}
          inputProps={{ min: "0", step: "1" }} 
          InputLabelProps={{
            shrink: true,
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            saveInstances();
            toggle(false);
          }}
        >
          Зберегти
        </Button>
      </ModalFooter>
    </Modal>
  );
}
