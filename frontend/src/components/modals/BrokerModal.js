import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'reactstrap';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import HelpIcon from '@mui/icons-material/Help';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';

const TRANSPORTER_NAME = "TCP";
const SERIALIZER_NAME = "JSON";
const THRESHOLD = 0.5;
const MIN_REQUEST_COUNT = 20;
const WINDOW_TIME = 60;
const HALF_OPEN_TIME = 10_000;

const RETRIES = 5;
const DELAY = 100;
const MAX_DELAY = 2000;
const FACTOR = 2;

const CONCURRENCY = 3;
const MAX_QUEUE = 10;

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

  const [retryPolicyData, setRetryPolicyData] = useState({
    enabled: false,
    retries: RETRIES,
    delay: DELAY,
    maxDelay: MAX_DELAY,
    factor: FACTOR,
  });

  const [bulkheadData, setBulkheadData] = useState({
    enabled: false,
    concurrency: CONCURRENCY,
    maxQueueSize: MAX_QUEUE,
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
      circuitBraker: {
        enabled: false,
        threshold: THRESHOLD,
        minRequestCount: MIN_REQUEST_COUNT,
        windowTime: WINDOW_TIME,
        halfOpenTime: HALF_OPEN_TIME,
      },
      retry: {
        enabled: false,
        retries: RETRIES,
        delay: DELAY,
        maxDelay: MAX_DELAY,
        factor: FACTOR,
      },
      bulkhead: {
        enabled: false,
        concurrency: CONCURRENCY,
        maxQueueSize: MAX_QUEUE,
      },
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

          <FormControl sx={{ m: 1, width: 300 }}>
            <FormControlLabel
              control={
                <Checkbox checked={retryPolicyData.enabled} onChange={(e) => setRetryPolicyData({...retryPolicyData, enabled: !retryPolicyData.enabled})} name="retry" />
              }
              label="Retry Policy"
            />
          </FormControl>
          { retryPolicyData.enabled ? 
            <div>
              <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                  <TextField
                    label="retries"
                    type="number"
                    value={retryPolicyData.retries ?? 0}
                    onChange={(e) => setRetryPolicyData({...retryPolicyData, retries: e.target.value >= 0 ? (e.target.value) : 0})}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl> 
                <div className="vertical-align">
                  <Tooltip title="Кількість повторних спроб">
                      <HelpIcon></HelpIcon>
                  </Tooltip>
                </div>
              </div>
              <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                  <TextField
                    label="delay"
                    type="number"
                    value={retryPolicyData.delay ?? 0}
                    onChange={(e) => setRetryPolicyData({...retryPolicyData, delay: e.target.value})}
                    inputProps={{ min: "0", step: "1" }} 
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl> 
                <div className="vertical-align">
                  <Tooltip title="Перша затримка в мілісекундах">
                      <HelpIcon></HelpIcon>
                  </Tooltip>
                </div>
              </div>
              <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                  <TextField
                    label="maxDelay"
                    type="number"
                    value={retryPolicyData.maxDelay ?? 0}
                    onChange={(e) => setRetryPolicyData({...retryPolicyData, maxDelay: e.target.value})}
                    inputProps={{ min: "0", step: "1" }} 
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <div className="vertical-align">
                  <Tooltip title="Максимальна затримка в мілісекундах">
                      <HelpIcon></HelpIcon>
                  </Tooltip>
                </div>
              </div>
              <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                  <TextField
                    label="factor"
                    type="number"
                    value={retryPolicyData.factor ?? 0}
                    onChange={(e) => setRetryPolicyData({...retryPolicyData, factor: e.target.value})}
                    inputProps={{ min: "0", step: "1" }} 
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <div className="vertical-align">
                  <Tooltip title="Коефіцієнт затримки. 2 означає експоненціальну затримку">
                    <HelpIcon></HelpIcon>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            : null
          }
          <FormControl sx={{ m: 1, width: 300 }}>
            <FormControlLabel
              control={
                <Checkbox checked={bulkheadData.enabled} onChange={(e) => setBulkheadData({...bulkheadData, enabled: !bulkheadData.enabled})} name="bulkhead" />
              }
              label="Bulkhead"
            />
          </FormControl>
          { bulkheadData.enabled ? 
            <div>
              <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                  <TextField
                    label="concurrency"
                    type="number"
                    value={bulkheadData.concurrency ?? 0}
                    onChange={(e) => setBulkheadData({...bulkheadData, concurrency: e.target.value >= 0 ? (e.target.value) : 0})}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl> 
                <div className="vertical-align">
                  <Tooltip title="Максимальна кількість паралельних виконань">
                      <HelpIcon></HelpIcon>
                  </Tooltip>
                </div>
              </div>
              <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                  <TextField
                    label="maxQueueSize"
                    type="number"
                    value={bulkheadData.maxQueueSize ?? 0}
                    onChange={(e) => setBulkheadData({...bulkheadData, maxQueueSize: e.target.value})}
                    inputProps={{ min: "0", step: "1" }} 
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl> 
                <div className="vertical-align">
                  <Tooltip title="Максимальний розмір черги">
                      <HelpIcon></HelpIcon>
                  </Tooltip>
                </div>
              </div>
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
                  circuitBraker: {
                    threshold: circuitBrakerData.threshold,
                    minRequestCount: circuitBrakerData.minRequestCount,
                    windowTime: circuitBrakerData.windowTime,
                    halfOpenTime: circuitBrakerData.halfOpenTime,
                  },
                  retry: {
                    enabled: retryPolicyData.enabled,
                    retries: retryPolicyData.retries,
                    delay: retryPolicyData.delay,
                    maxDelay: retryPolicyData.maxDelay,
                    factor: retryPolicyData.factor,
                  },
                  bulkhead: {
                    enabled: bulkheadData.enabled,
                    concurrency: bulkheadData.concurrency,
                    maxQueueSize: bulkheadData.maxQueueSize,
                  },
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
