import { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';

export function MicroservicesModal({isOpen, toggle, saveMicroserviceName}) {
  const [microserviceName, setMicroserviceName] = useState("");

  return (
    <Modal 
      isOpen={isOpen}
      onClosed={toggle}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        Назва мікросервісу
      </ModalHeader>
      <ModalBody>
        <TextField sx={{width: "100%"}}
          label="Назва мікросервісу"
          value={microserviceName ?? ""}
          onChange={(e) => setMicroserviceName(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            saveMicroserviceName(microserviceName);
            setMicroserviceName("");
            toggle(false);
          }}
        >
          Зберегти
        </Button>
      </ModalFooter>
    </Modal>
  );
}
