import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ApiIcon from '@mui/icons-material/Api';
import HubIcon from '@mui/icons-material/Hub';
import { MicroserviceIcon } from '../assets/icons/MicroserviceIcon';

import './../css/dbManagementBar.scss';

import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'reactstrap';
import SwitchUnstyled, { switchUnstyledClasses } from '@mui/base/SwitchUnstyled';

const blue = {
  500: '#007FFF',
};

const grey = {
  400: '#BFC7CF',
  500: '#AAB4BE',
  600: '#6F7E8C',
};

const Root = styled('span')(
  ({ theme }) => `
  font-size: 0;
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  margin: 10px;
  cursor: pointer;

  &.${switchUnstyledClasses.disabled} {
    opacity: 0.4;
    cursor: not-allowed;
  }

  & .${switchUnstyledClasses.track} {
    background: ${theme.palette.mode === 'dark' ? grey[600] : grey[400]};
    border-radius: 10px;
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
  }

  & .${switchUnstyledClasses.thumb} {
    display: block;
    width: 14px;
    height: 14px;
    top: 3px;
    left: 3px;
    border-radius: 16px;
    background-color: #fff;
    position: relative;
    transition: all 200ms ease;
  }

  &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
    background-color: ${grey[500]};
    box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
  }

  &.${switchUnstyledClasses.checked} {
    .${switchUnstyledClasses.thumb} {
      left: 22px;
      top: 3px;
      background-color: #fff;
    }

    .${switchUnstyledClasses.track} {
      background: ${blue[500]};
    }
  }

  & .${switchUnstyledClasses.input} {
    cursor: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
    margin: 0;
  }
  `,
);

export function MsManagementBar({addMethod, addMicroservice, setGatewayFrom, microserviceName, displayForm, setDisplayForm, arrowType, clear}) {
  //const [displayForm, setDisplayForm] = useState(false);
  let [propsLength, setPropsLength] = useState(1);
  const [methodInfo, setMethodInfo] = useState({
    microservice: microserviceName,
    name: "",
    props: [],
  });

  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    setMethodInfo({...methodInfo, microservice: microserviceName})
  }, [microserviceName]);

  const addProps = (e) => {
    e.preventDefault();
    setPropsLength(++propsLength);
  };

  const removeProps = (i) => {
    methodInfo.props.splice(i, 1);
    setMethodInfo(methodInfo);
    setPropsLength(--propsLength);
  }

  const changeProps = (props, id, changes) => {
    const existingProp = methodInfo.props.find(f => f.id === id);
    if (existingProp) { 
      if (changes.name) existingProp.name = changes.name;
      if (changes.type) existingProp.type = changes.type;
      return props;
    };

    return [
      ...props, 
      {
        id, 
        name: changes.name, 
        type: changes.type ?? '', 
      },
    ];
  }

  return (
    <div>
      <div>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <MuiButton variant="outlined" sx={{margin: 1}} onClick={addMicroservice} startIcon={<HubIcon />}>
            Додати мікросервіс
          </MuiButton>
          <MuiButton variant="outlined" sx={{margin: 1}} onClick={setGatewayFrom} startIcon={<ApiIcon />}>
            Додати API-шлюз
          </MuiButton>
          <div className="connection">
            Тип зв'язка
          </div>
          <ButtonGroup sx={{margin: 1}} aria-label="outlined button group">
            <MuiButton variant={toggle ? "contained" : "outlined"} onClick={(e) => {
              arrowType.current = 'event';
              setToggle(!toggle);
            }}>Подія</MuiButton>
            <MuiButton variant={!toggle ? "contained" : "outlined"} onClick={(e) => {
              arrowType.current = 'rpc';
              setToggle(!toggle);
            }}>Sync RPC</MuiButton>
          </ButtonGroup>
          <div className="connection">
            <SwitchUnstyled component={Root} defaultChecked />
          </div>
          <div className="connection">
            API-шлюз
          </div>
          <IconButton sx={{margin: 1}} aria-label="delete" size="large" color="error" onClick={clear}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </div>
      <Modal
        isOpen={displayForm}
        onClosed={() => setDisplayForm(false)}
        toggle={() => setDisplayForm(false)}
      >
        <ModalHeader toggle={() => setDisplayForm(false)}>
          Додати функцію до мікросервісу
        </ModalHeader>
        <ModalBody>
          <form className="form">
            <label className="stretch">
              Назва мікросервісу:
              <Input defaultValue={microserviceName} type="text" name="ms_name" onChange={
                e => setMethodInfo({...methodInfo, microservice: e.target.value})
              } placeholder="Введіть назву мікросервісу..." />
            </label>
            <label className="stretch">
              Назва функції:
              <Input value={methodInfo.name} type="text" name="method_name" onInput={
                e => setMethodInfo({...methodInfo, name: e.target.value})
              } placeholder="Введіть назву методу..." />
            </label>
            { 
              new Array(propsLength).fill(0).map((el, i) => <div className="item" key={`prop_${i}`} >
                <div className="removeButton">
                  <button type="button" className="btn-close" aria-label="Delete" onClick={(e) => removeProps(i)}></button>
                </div>
                <div>
                  <label className="form-check-label" htmlFor={`name_${i}`}>
                    Назва аргументу:
                  </label>
                  <Input id={`name_${i}`} value={methodInfo[`prop_${i}`]?.name} type="text" name={`prop_${i}`} onInput={e => setMethodInfo(
                    {...methodInfo, props: changeProps(methodInfo.props, `prop_${i}`, { name: e.target.value })}
                  )} placeholder="Введіть назву аргументу..." />
                </div>
                <div>
                  <label className="form-check-label" htmlFor={`name_${i}`}>
                    Тип аргументу:
                  </label>
                  <Input id={`name_${i}`} value={methodInfo[`prop_${i}`]?.name} type="text" name={`prop_${i}`} onInput={e => setMethodInfo(
                    {...methodInfo, props: changeProps(methodInfo.props, `prop_${i}`, { type: e.target.value })}
                  )} placeholder="Введіть тип аргументу..." />
                </div>
              </div>)
            }
            <Button
              color="primary"
              onClick={(e) => {
                addProps(e);
              }}
              outline
              size="sm"
            >
              Додати аргумент
            </Button>
            
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              addMethod(e, methodInfo);
              setDisplayForm(false);
              setMethodInfo({
                microservice: "",
                name: "",
                props: [],
              });
            }}
          >
            Додати
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}