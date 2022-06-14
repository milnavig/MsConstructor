import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const EXPORTER = "Disabled";

export function TracingModal({isOpen, toggle, moleculerOptions, setMoleculerOptions}) {
  const [tracingData, setTracingData] = useState({
    enable: false,
    exporter: EXPORTER,
  });

  const exporters = ["Disabled", "Console"];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleExporterChange = (event) => {
    const {
      target: { value },
    } = event;
    setTracingData({...tracingData, exporter: value, enable: value === "Disabled" ? false : true});
  };

  useEffect(() => {
    moleculerOptions.tracing = {
      enable: false,
      exporter: EXPORTER,
    };
    setMoleculerOptions(() => moleculerOptions);
  }, []);

  return (
    <Modal 
      isOpen={isOpen}
      onClosed={toggle}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        Налаштування відстеження
      </ModalHeader>
      <ModalBody>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="label-3">Exporter</InputLabel>
          <Select
            labelId="label-3"
            id="select-3"
            value={tracingData.exporter}
            onChange={handleExporterChange}
            input={<OutlinedInput label="exporter" />}
            MenuProps={MenuProps}
          >
            {exporters.map((exporter) => (
              <MenuItem
                key={exporter}
                value={exporter}
              >
                {exporter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            setMoleculerOptions({
              ...moleculerOptions, 
              tracing: {
                enable: tracingData.enable,
                exporter: tracingData.exporter,
              }
            });
            toggle(false);
          }}
        >
          Зберегти
        </Button>
      </ModalFooter>
    </Modal>
  );
}
