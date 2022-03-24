import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import Box from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SmsIcon from '@mui/icons-material/Sms';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import BalanceIcon from '@mui/icons-material/Balance';
import TimelineIcon from '@mui/icons-material/Timeline';
import SettingsIcon from '@mui/icons-material/Settings';
import SchemaIcon from '@mui/icons-material/Schema';
import { ServiceDiscoveryModal } from './modals/ServiceDiscoveryModal';
import { LoadBalancerModal } from './modals/LoadBalancerModal';
import { BrokerModal } from './modals/BrokerModal';
import { LoggerModal } from './modals/LoggerModal';
import { TracingModal } from './modals/TracingModal';

export function MainMenu({saveSchemeHandler, moleculerOptions, setMoleculerOptions, setTestScheme, openSchemeHandler}) {
  const [displayBrokerForm, setDisplayBrokerForm] = useState(false);
  const [displayLoggerForm, setDisplayLoggerForm] = useState(false);
  const [displayDiscoveryForm, setDisplayDiscoveryForm] = useState(false);
  const [displayBalancerForm, setDisplayBalancerForm] = useState(false);
  const [displayTracingForm, setDisplayTracingForm] = useState(false);
  //const [moleculerOptions, setMoleculerOptions] = useState({});

  return (
    <div>
      <LoggerModal 
        isOpen={displayLoggerForm} 
        toggle={() => setDisplayLoggerForm(false)} 
        moleculerOptions={moleculerOptions} 
        setMoleculerOptions={setMoleculerOptions}
      ></LoggerModal>
      <BrokerModal 
        isOpen={displayBrokerForm} 
        toggle={() => setDisplayBrokerForm(false)} 
        moleculerOptions={moleculerOptions} 
        setMoleculerOptions={setMoleculerOptions}
      ></BrokerModal>
      <ServiceDiscoveryModal 
        isOpen={displayDiscoveryForm} 
        toggle={() => setDisplayDiscoveryForm(false)}
        moleculerOptions={moleculerOptions} 
        setMoleculerOptions={setMoleculerOptions}
      ></ServiceDiscoveryModal>
      <LoadBalancerModal 
        isOpen={displayBalancerForm} 
        toggle={() => setDisplayBalancerForm(false)}
        moleculerOptions={moleculerOptions} 
        setMoleculerOptions={setMoleculerOptions}
      ></LoadBalancerModal>
      <TracingModal
        isOpen={displayTracingForm} 
        toggle={() => setDisplayTracingForm(false)}
        moleculerOptions={moleculerOptions} 
        setMoleculerOptions={setMoleculerOptions}
      ></TracingModal>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <input id="fileupload" type="file" style={{display: "none"}} name="fileupload" /> 
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} color="success" startIcon={<PlayArrowIcon />}>
          Згенерувати програму
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} onClick={saveSchemeHandler} startIcon={<DownloadIcon />}>
          Завантажити схему
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} onClick={openSchemeHandler} startIcon={<UploadIcon />}>
          Відкрити схему
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} startIcon={<SettingsIcon />}>
          Загальні налаштування
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} onClick={() => setDisplayBrokerForm(true)} startIcon={<ManageAccountsIcon />}>
          Налаштування брокеру
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} onClick={() => setDisplayLoggerForm(true)} startIcon={<SmsIcon />}>
          Налаштування логгеру
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} onClick={() => setDisplayDiscoveryForm(true)} startIcon={<SavedSearchIcon />}>
          Виявлення сервісів
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} onClick={() => setDisplayBalancerForm(true)} startIcon={<BalanceIcon />}>
          Балансувальник навантаження
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1, borderRadius: "0px"}} onClick={() => setDisplayTracingForm(true)} startIcon={<TimelineIcon />}>
          Відстеження
        </MuiButton>
        <MuiButton variant="contained" color="success" sx={{margin: 1, borderRadius: "0px"}} onClick={() => setTestScheme()} startIcon={<SchemaIcon />}>
          Тестова схема
        </MuiButton>
      </Box>
    </div>
  );
}