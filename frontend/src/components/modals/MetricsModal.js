import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';

const METRICS = "Console";
const INTERVAL = 5;

export function MetricsModal({isOpen, toggle, moleculerOptions, setMoleculerOptions}) {
  const [metricsData, setMetricsData] = useState({
    metrics: METRICS,
    interval: INTERVAL,
    onlyChanges: "true",
  });

  const handleMetricsChange = (event) => {
    const {
      target: { value },
    } = event;
    setMetricsData({...metricsData, metrics: value});
  };

  useEffect(() => {
    moleculerOptions.metrics = {
      metrics: METRICS,
      interval: INTERVAL,
      onlyChanges: "true",
    };
    setMoleculerOptions(() => moleculerOptions);
  }, []);

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

  const metrics = [
    "Console",
    "CSV",
  ];

  return (
    <Modal 
      isOpen={isOpen}
      onClosed={toggle}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        Налаштування метрики
      </ModalHeader>
      <ModalBody>
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="label-metrics">metrics</InputLabel>
            <Select
              labelId="label-metrics"
              id="select-metrics"
              value={metricsData.metrics}
              onChange={handleMetricsChange}
              input={<OutlinedInput label="metrics" />}
              MenuProps={MenuProps}
            >
              {metrics.map((metric) => (
                  <MenuItem
                    key={metric}
                    value={metric}
                  >
                    {metric}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="vertical-align">
            <Tooltip title="Оберіть тип метрики">
                <HelpIcon></HelpIcon>
            </Tooltip>
          </div>
        </div>
        {
          metricsData.metrics === METRICS ? 
          <>
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  label="interval"
                  type="number"
                  value={metricsData.interval ?? 0}
                  onChange={(e) => setMetricsData({...metricsData, interval: e.target.value})}
                  inputProps={{ min: "0", step: "1" }} 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <div className="vertical-align">
                <Tooltip title="Інтервал публікації в секундах">
                    <HelpIcon></HelpIcon>
                </Tooltip>
              </div>
            </div>
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="label-onlyChanges">onlyChanges</InputLabel>
                <Select
                  labelId="label-onlyChanges"
                  id="select-onlyChanges"
                  value={metricsData.onlyChanges}
                  onChange={(e) => setMetricsData({...metricsData, onlyChanges: e.target.value})}
                  input={<OutlinedInput label="onlyChanges" />}
                  MenuProps={MenuProps}
                >
                  {["true", "false"].map((b) => (
                      <MenuItem
                        key={b}
                        value={b}
                      >
                        {b}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="vertical-align">
                <Tooltip title="Інтервал публікації в секундах">
                    <HelpIcon></HelpIcon>
                </Tooltip>
              </div>
            </div>
          </>
          :
          <>
            <div>
              <FormControl disabled sx={{ m: 1, width: 300 }}>
                <TextField
                  label="folder"
                  value={"./reports/metrics"}
                />
              </FormControl>
              <div className="vertical-align">
                <Tooltip title="Місце зберігання метрик">
                    <HelpIcon></HelpIcon>
                </Tooltip>
              </div>
            </div>
            <div>
              <FormControl disabled sx={{ m: 1, width: 300 }}>
                <TextField
                  label="delimiter"
                  value={","}
                />
              </FormControl>
              <div className="vertical-align">
                <Tooltip title="роздільник">
                    <HelpIcon></HelpIcon>
                </Tooltip>
              </div>
            </div>
            <div>
              <FormControl disabled sx={{ m: 1, width: 300 }}>
                <TextField
                  label="rowDelimiter"
                  value={"\/n"}
                />
              </FormControl>
              <div className="vertical-align">
                <Tooltip title="роздільник рядків">
                    <HelpIcon></HelpIcon>
                </Tooltip>
              </div>
            </div>
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  label="interval"
                  type="number"
                  value={metricsData.interval ?? 0}
                  onChange={(e) => setMetricsData({...metricsData, interval: e.target.value})}
                  inputProps={{ min: "0", step: "1" }} 
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <div className="vertical-align">
                <Tooltip title="Інтервал публікації в секундах">
                    <HelpIcon></HelpIcon>
                </Tooltip>
              </div>
            </div>
          </>
        }
        
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            setMoleculerOptions({
              ...moleculerOptions, 
              metrics: {
                metrics: metricsData.metrics,
                interval: metricsData.interval,
                onlyChanges: metricsData.onlyChanges,
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
