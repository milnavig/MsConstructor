import { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';

export function EventModal({isOpen, toggle, diagram, currentLink}) {
  const [eventName, setEventName] = useState("");

  const saveEventName = () => {
    const link = diagram.current.findLinkForData(currentLink);
    //link.data.eventName = eventName;
    //diagram.current.requestUpdate();
    diagram.current.model.setDataProperty(link.data, "eventName", eventName);
  };

  return (
    <Modal 
      isOpen={isOpen}
      onClosed={toggle}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        Подія
      </ModalHeader>
      <ModalBody>
        <TextField sx={{width: "100%"}}
          label="Назва події"
          value={eventName ?? ""}
          onChange={(e) => setEventName(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            saveEventName();
            toggle(false);
          }}
        >
          Зберегти
        </Button>
      </ModalFooter>
    </Modal>
  );
}
