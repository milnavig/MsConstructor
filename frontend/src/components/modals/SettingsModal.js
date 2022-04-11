import { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';

export function SettingsModal({isOpen, toggle, saveAppName}) {
  const [appName, setAppName] = useState("");

  return (
    <Modal 
      isOpen={isOpen}
      onClosed={toggle}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        Налаштування
      </ModalHeader>
      <ModalBody>
        <TextField sx={{width: "100%"}}
          label="Назва додатку"
          value={appName ?? ""}
          onChange={(e) => setAppName(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            saveAppName(appName);
            //setAppName("");
            toggle(false);
          }}
        >
          Зберегти
        </Button>
      </ModalFooter>
    </Modal>
  );
}
