import { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';

const LOGGER = "Console";
const LOG_LEVEL = "info";
const FORMATTER = "full";

export function LoggerModal({isOpen, toggle, moleculerOptions, setMoleculerOptions}) {
  const [loggerData, setLoggerData] = useState({
    logger: LOGGER,
    logLevel: LOG_LEVEL,
    color: "false",
    moduleColor: "true",
    formatter: FORMATTER,
  });

  const levels = [
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
  ];

  const loggers = [
    "Console",
    "File",
    "Pino",
    "Bunyan",
    "Winston",
  ];

  const formatters = [
    "full",
    "json",
    "short",
    "simple",
  ];

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

  const handleColorChange = (event) => {
    const {
      target: { value },
    } = event;
    setLoggerData({...loggerData, color: value});
  };

  const handleModuleColorChange = (event) => {
    const {
      target: { value },
    } = event;
    setLoggerData({...loggerData, moduleColor: value});
  };

  const handleLevelChange = (event) => {
    const {
      target: { value },
    } = event;
    setLoggerData({...loggerData, logLevel: value});
  };

  const handleLoggerChange = (event) => {
    const {
      target: { value },
    } = event;
    setLoggerData({...loggerData, logger: value});
  };

  const handleFormatterChange = (event) => {
    const {
      target: { value },
    } = event;
    setLoggerData({...loggerData, formatter: value});
  };

  useEffect(() => {
    moleculerOptions.logger = {
      logger: LOGGER,
      logLevel: LOG_LEVEL,
      color: "false",
      moduleColor: "true",
      formatter: FORMATTER,
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
        Налаштування логгеру
      </ModalHeader>
      <ModalBody>
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="label-3">loggers</InputLabel>
            <Select
              labelId="label-3"
              id="select-3"
              value={loggerData.logger}
              onChange={handleLoggerChange}
              input={<OutlinedInput label="loggers" />}
              MenuProps={MenuProps}
            >
              {loggers.map((logger) => (
                  <MenuItem
                    key={logger}
                    value={logger}
                  >
                    {logger}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="vertical-align">
            <Tooltip title="Оберіть логгер">
                <HelpIcon></HelpIcon>
            </Tooltip>
          </div>
        </div>
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="label-5">logLevel</InputLabel>
            <Select
              labelId="label-5"
              id="select-5"
              value={loggerData.logLevel}
              onChange={handleLevelChange}
              input={<OutlinedInput label="logLevel" />}
              MenuProps={MenuProps}
            >
              {levels.map((level) => (
                <MenuItem
                  key={level}
                  value={level}
                >
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="vertical-align">
            <Tooltip title="Рівень логгеру">
                <HelpIcon></HelpIcon>
            </Tooltip>
          </div>
        </div>
        {loggerData.logger === LOGGER ? 
          <>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="label-4">colors</InputLabel>
              <Select
                labelId="label-4"
                id="select-4"
                value={loggerData.color}
                onChange={handleColorChange}
                input={<OutlinedInput label="colors" />}
                MenuProps={MenuProps}
              >
                {["false", "true"].map((color) => (
                  <MenuItem
                    key={color}
                    value={color}
                  >
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="vertical-align">
              <Tooltip title="Використовувати кольори при виводі логів">
                  <HelpIcon></HelpIcon>
              </Tooltip>
            </div>
          </div>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="label-6">moduleColors</InputLabel>
              <Select
                labelId="label-6"
                id="select-6"
                value={loggerData.moduleColor}
                onChange={handleModuleColorChange}
                input={<OutlinedInput label="moduleColors" />}
                MenuProps={MenuProps}
              >
                {["false", "true"].map((moduleColor) => (
                  <MenuItem
                    key={moduleColor}
                    value={moduleColor}
                  >
                    {moduleColor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="vertical-align">
              <Tooltip title="Друкувати назви модулів різними кольорами">
                  <HelpIcon></HelpIcon>
              </Tooltip>
            </div>
          </div>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="label-7">formatters</InputLabel>
              <Select
                labelId="label-7"
                id="select-7"
                value={loggerData.formatter}
                onChange={handleFormatterChange}
                input={<OutlinedInput label="formatters" />}
                MenuProps={MenuProps}
              >
                {formatters.map((formatter) => (
                  <MenuItem
                    key={formatter}
                    value={formatter}
                  >
                    {formatter}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="vertical-align">
              <Tooltip title="Форматування рядків">
                  <HelpIcon></HelpIcon>
              </Tooltip>
            </div>
          </div>
          </>
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
              logger: {
                logger: loggerData.logger,
                logLevel: loggerData.logLevel,
                color: loggerData.color,
                moduleColor: loggerData.moduleColor,
                formatter: loggerData.formatter,
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
