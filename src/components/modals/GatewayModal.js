import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';

export function GatewayModal({isOpen, toggle, handleAddGateway}) {
  let [endpointsLength, setEndpointsLength] = useState(1);
  //const [gatewayData, setGatewayData] = useState({});
  const [gatewayData, setGatewayData] = useState([]);

  const methods = [
    "GET", "OPTIONS", "POST", "PUT", "DELETE",
  ];

  const addGatewayData = (e) => {
    e.preventDefault();
    setEndpointsLength(++endpointsLength);
  };

  const removeGatewayData = (i) => {
    gatewayData.splice(i, 1);
    //delete gatewayData[i];
    setGatewayData(gatewayData);
    setEndpointsLength(--endpointsLength);
  }

  const addGateway = () => {
    handleAddGateway(gatewayData);
  }

  return (
    <Modal 
      isOpen={isOpen}
      onClosed={toggle}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        API-шлюз
      </ModalHeader>
      <ModalBody>
        { 
          new Array(endpointsLength).fill(0).map((el, i) => <div key={`api_${i}`} >
            <div className="removeButton">
              <button type="button" className="btn-close" aria-label="Delete" onClick={(e) => removeGatewayData(i)}></button>
            </div>
            <div>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="method">Method</InputLabel>
                <Select
                  labelId="method"
                  value={gatewayData[i]?.method ?? "GET"}
                  onChange={(e) => {
                    gatewayData[i] ?? (gatewayData[i] = {});
                    gatewayData[i].method = e.target.value;
                    setGatewayData([...gatewayData]);
                  }}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  label="Method"
                >
                  ${
                    methods.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)
                  }
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor={`url-${i}`}>URL</InputLabel>
                <OutlinedInput
                  id={`url-${i}`}
                  label="URL"
                  startAdornment={<InputAdornment position="start">/</InputAdornment>}
                  value={gatewayData[i]?.url ?? ''}
                  onChange={(e) => {
                    gatewayData[i] ?? (gatewayData[i] = {});
                    gatewayData[i].url = e.target.value;
                    setGatewayData([...gatewayData]);
                  }}
                />
              </FormControl>
            </div>
          </div>)
        }
        <Button
          className="margin-10"
          color="primary"
          onClick={(e) => {
            addGatewayData(e);
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
            addGateway();
            //saveMetadata();
            toggle(false);
          }}
        >
          Зберегти
        </Button>
      </ModalFooter>
    </Modal>
  );
}
