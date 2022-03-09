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

const STRATEGY_NAME = "RoundRobin";
const SAMPLE_COUNT = 3;
const LOW_CPU_USAGE = 10;
const LOW_LATENCY = 10;
const COLLECT_COUNT = 5;
const PING_INTERVAL = 10;

export function LoadBalancerModal({isOpen, toggle, moleculerOptions, setMoleculerOptions}) {
  const [strategyName, setStrategyName] = useState(STRATEGY_NAME);
  const [options, setOptions] = useState({
    sampleCount: SAMPLE_COUNT,
    lowCpuUsage: LOW_CPU_USAGE,
    lowLatency: LOW_LATENCY,
    collectCount: COLLECT_COUNT,
    pingInterval: PING_INTERVAL,
  });

  const strategies = ["RoundRobin", "Random", "CpuUsage", "Latency"];

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

  const handleStrategyChange = (event) => {
    const {
      target: { value },
    } = event;
    setStrategyName(value);
  };

  useEffect(() => {
    moleculerOptions.loadBalancer = {
      strategy: STRATEGY_NAME,
      sampleCount: SAMPLE_COUNT,
      lowCpuUsage: LOW_CPU_USAGE,
      lowLatency: LOW_LATENCY,
      collectCount: COLLECT_COUNT,
      pingInterval: PING_INTERVAL,
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
          Балансувальник навантаження
        </ModalHeader>
        <ModalBody>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="label-discoverer">Стратегія</InputLabel>
            <Select
              labelId="label-discoverer"
              value={strategyName}
              onChange={handleStrategyChange}
              input={<OutlinedInput label="Strategy" />}
              MenuProps={MenuProps}
            >
              {strategies.map((strategy) => (
                <MenuItem
                  key={strategy}
                  value={strategy}
                >
                  {strategy}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          { strategyName === "CpuUsage" || strategyName === "Latency" ? 
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                id="outlined-number"
                label="sampleCount"
                type="number"
                value={options.sampleCount ?? 0}
                
                onChange={(e) => setOptions({...options, sampleCount: e.target.value >= 0 ? e.target.value : 0})}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            : null 
          }
          { strategyName === "Latency" ? 
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  id="outlined-number"
                  label="lowLatency"
                  type="number"
                  value={options.lowLatency ?? 0}
                  onChange={(e) => setOptions({...options, lowLatency: e.target.value >= 0 ? e.target.value : 0})}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  id="outlined-number"
                  label="collectCount"
                  type="number"
                  value={options.collectCount ?? 0}
                  onChange={(e) => setOptions({...options, collectCount: e.target.value >= 0 ? e.target.value : 0})}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  id="outlined-number"
                  label="pingInterval"
                  type="number"
                  value={options.pingInterval ?? 0}
                  onChange={(e) => setOptions({...options, pingInterval: e.target.value >= 0 ? e.target.value : 0})}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>

            </div>
            : null
          }
          { strategyName === "CpuUsage" ? 
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  id="outlined-number"
                  label="lowCpuUsage"
                  type="number"
                  value={options.lowCpuUsage ?? 0}
                  onChange={(e) => setOptions({...options, lowCpuUsage: e.target.value >= 0 ? e.target.value : 0})}
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
                loadBalancer: {
                  strategy: strategyName,
                  sampleCount: options.sampleCount,
                  lowCpuUsage: options.lowCpuUsage,
                  lowLatency: options.lowLatency,
                  collectCount: options.collectCount,
                  pingInterval: options.pingInterval,
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
