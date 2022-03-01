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
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

const TRANSPORTER_NAME = "TCP";
const SERIALIZER_NAME = "JSON";
const THRESHOLD = 0.5;
const MIN_REQUEST_COUNT = 20;
const WINDOW_TIME = 60;
const HALF_OPEN_TIME = 10_000;

export function BrokerModal({isOpen, toggle, moleculerOptions, setMoleculerOptions}) {
  const [transporterName, setTransporterName] = useState(TRANSPORTER_NAME);
  const [serializerName, setSerializerName] = useState(SERIALIZER_NAME);
  const [circuitBrakerData, setCircuitBrakerData] = useState({
    enabled: false,
    threshold: THRESHOLD,
    minRequestCount: MIN_REQUEST_COUNT,
    windowTime: WINDOW_TIME,
    halfOpenTime: HALF_OPEN_TIME,
  });

  const transporters = [
    "TCP",
    "NATS",
    "Redis",
    "MQTT",
    "AMQP (0.9)",
    "AMQP (1.0)",
    "Kafka",
    "NATS Streaming (STAN)",
  ];

  const serializers = [
    "JSON",
    "Avro",
    "MsgPack",
    "Notepack",
    "ProtoBuf",
    "Thrift",
    "CBOR",
  ];

  const handleTransporterChange = (event) => {
    const {
      target: { value },
    } = event;
    setTransporterName(value);
  };

  const handleSerializerChange = (event) => {
    const {
      target: { value },
    } = event;
    setSerializerName(value);
  };

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

  useEffect(() => {
    moleculerOptions.broker = {
      transporter: TRANSPORTER_NAME,
      serializer: SERIALIZER_NAME,
      enabled: false,
      threshold: THRESHOLD,
      minRequestCount: MIN_REQUEST_COUNT,
      windowTime: WINDOW_TIME,
      halfOpenTime: HALF_OPEN_TIME,
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
          Налаштування брокеру
        </ModalHeader>
        <ModalBody>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="label-1">Transporter</InputLabel>
            <Select
              labelId="label-1"
              id="select-1"
              value={transporterName}
              onChange={handleTransporterChange}
              input={<OutlinedInput label="Transporter" />}
              MenuProps={MenuProps}
            >
              {transporters.map((transporter) => (
                <MenuItem
                  key={transporter}
                  value={transporter}
                >
                  {transporter}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="label-2">Serializer</InputLabel>
              <Select
                labelId="label-2"
                id="select-2"
                value={serializerName}
                onChange={handleSerializerChange}
                input={<OutlinedInput label="Serializer" />}
                MenuProps={MenuProps}
              >
                {serializers.map((serializer) => (
                  <MenuItem
                    key={serializer}
                    value={serializer}
                  >
                    {serializer}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 300 }}>
            <FormControlLabel
              control={
                <Checkbox checked={circuitBrakerData.enabled} onChange={(e) => setCircuitBrakerData({...circuitBrakerData, enabled: !circuitBrakerData.enabled})} name="circuit_braker" />
              }
              label="Запобіжник"
            />
          </FormControl>
          { circuitBrakerData.enabled ? 
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  label="threshold"
                  type="number"
                  value={circuitBrakerData.threshold ?? 0}
                  onChange={(e) => setCircuitBrakerData({...circuitBrakerData, threshold: e.target.value >= 0 ? (e.target.value) : 0})}
                  inputProps={{ min: "0", max: "1", step: "0.1" }} 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl> 
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  label="minRequestCount"
                  type="number"
                  value={circuitBrakerData.minRequestCount ?? 0}
                  onChange={(e) => setCircuitBrakerData({...circuitBrakerData, minRequestCount: e.target.value})}
                  inputProps={{ min: "0", step: "1" }} 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl> 
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  label="windowTime"
                  type="number"
                  value={circuitBrakerData.windowTime ?? 0}
                  onChange={(e) => setCircuitBrakerData({...circuitBrakerData, windowTime: e.target.value})}
                  inputProps={{ min: "0", step: "1" }} 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  label="halfOpenTime"
                  type="number"
                  value={circuitBrakerData.halfOpenTime ?? 0}
                  onChange={(e) => setCircuitBrakerData({...circuitBrakerData, halfOpenTime: e.target.value})}
                  inputProps={{ min: "0", step: "1" }} 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </div>
            
            : null
          }
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              setMoleculerOptions({
                ...moleculerOptions, 
                broker: {
                  transporter: transporterName, 
                  serializer: serializerName, 
                  threshold: circuitBrakerData.threshold,
                  minRequestCount: circuitBrakerData.minRequestCount,
                  windowTime: circuitBrakerData.windowTime,
                  halfOpenTime: circuitBrakerData.halfOpenTime,
                },
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
