import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'reactstrap';
import Box from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SmsIcon from '@mui/icons-material/Sms';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import TextField from '@mui/material/TextField';

const DISCOVERER_NAME = "Local";
const HEARTBEAT_INTERVAL = 10;
const HEARTBEAT_TIMEOUT = 30;

export function ServiceDiscoveryModal({isOpen, toggle, moleculerOptions, setMoleculerOptions}) {
  const [discovererName, setDiscovererName] = useState(DISCOVERER_NAME);
  const [options, setOptions] = useState({
    heartbeatInterval: HEARTBEAT_INTERVAL,
    heartbeatTimeout: HEARTBEAT_TIMEOUT,
  });

  const discoverers = ["Local", "Redis", "etcd3"];

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

  const handleDiscovererChange = (event) => {
    const {
      target: { value },
    } = event;
    setDiscovererName(value);
  };

  useEffect(() => {
    moleculerOptions.serviceDiscovery = {
      discoverer: DISCOVERER_NAME,
      heartbeatInterval: HEARTBEAT_INTERVAL,
      heartbeatTimeout: HEARTBEAT_TIMEOUT,
    };
    setMoleculerOptions(() => moleculerOptions);
  }, []);

  return (
    <div>
      <Modal 
        isOpen={isOpen}
        onClosed={toggle}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>
          Виявлення сервісів
        </ModalHeader>
        <ModalBody>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="label-discoverer">Discoverer</InputLabel>
            <Select
              labelId="label-discoverer"
              value={discovererName}
              onChange={handleDiscovererChange}
              input={<OutlinedInput label="Discoverer" />}
              MenuProps={MenuProps}
            >
              {discoverers.map((discoverer) => (
                <MenuItem
                  key={discoverer}
                  value={discoverer}
                >
                  {discoverer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
              id="outlined-number"
              label="heartbeatInterval"
              type="number"
              value={options.heartbeatInterval ?? 0}
              onChange={(e) => setOptions({...options, heartbeatInterval: e.target.value})}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
              id="outlined-number"
              label="heartbeatTimeout"
              type="number"
              value={options.heartbeatTimeout ?? 0}
              onChange={(e) => setOptions({...options, heartbeatTimeout: e.target.value})}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              setMoleculerOptions({
                ...moleculerOptions, 
                serviceDiscovery: {
                  discoverer: discovererName,
                  heartbeatInterval: options.heartbeatInterval,
                  heartbeatTimeout: options.heartbeatTimeout,
                }
              });
              toggle(false);
            }}
          >
            Зберегти
          </Button>
        </ModalFooter>
      </Modal>
    </div>);
}
