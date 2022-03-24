import { useState } from 'react';
import { datatypes} from './../helpers/datatypes';
import Box from '@mui/material/Box';

//import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import './../css/dbManagementBar.scss';

import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'reactstrap';
import MuiButton from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TableChartIcon from '@mui/icons-material/TableChart';
import ButtonGroup from '@mui/material/ButtonGroup';

export function DbManagementBar({currentModel, addTable, selectRelationship, onClick}) {
  const [displayForm, setDisplayForm] = useState(false);
  let [fieldsLength, setFieldsLength] = useState(1);
  const [tableInfo, setTableInfo] = useState({
    name: '',
    fields: [],
  });
  const [toggle, setToggle] = useState(true);

  const showForm = (e) => {
    e.preventDefault();
    setDisplayForm(true);
  };

  const addField = (e) => {
    e.preventDefault();
    setFieldsLength(++fieldsLength);
  };

  const removeField = (i) => {
    tableInfo.fields.splice(i, 1);
    setTableInfo(tableInfo);
    setFieldsLength(--fieldsLength);
  }

  const changeField = (fields, id, changes) => {
    const existingField = tableInfo.fields.find(f => f.id === id);
    if (existingField) { 
      if (changes.name) existingField.name = changes.name;
      if (changes.type) existingField.type = changes.type;
      if (changes.uniqueClicked) existingField.unique = !existingField.unique;
      if (changes.notNullClicked) existingField.not_null = !existingField.not_null;
      if (changes.pkClicked) existingField.pk = !existingField.pk;
      return fields;
    };

    return [
      ...fields, 
      {
        id, 
        name: changes.name, 
        type: changes.type ?? datatypes[0], 
        unique: changes.unique ?? false, 
        not_null: changes.not_null ?? false, 
        pk: changes.pk ?? false
      },
    ];
  }

  return (
    <div>
      { currentModel !== 'main' ? 
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <MuiButton variant="outlined" sx={{margin: 1}} onClick={onClick} startIcon={<ArrowBackIcon />}>
          Назад
        </MuiButton>
        <MuiButton variant="outlined" sx={{margin: 1}} onClick={showForm} startIcon={<TableChartIcon />}>
          Додати таблицю
        </MuiButton>
        <div className="connection">
          Тип зв'язка
        </div>
        <ButtonGroup variant="outlined" sx={{margin: 1}} aria-label="outlined button group">
          <MuiButton
            variant={toggle ? "contained" : "outlined"}
            color="primary"
            onClick={(e) => {
              setToggle(!toggle);
              selectRelationship("one-to-many");
            }}
          >
            One-to-Many
          </MuiButton>
          <MuiButton
            variant={!toggle ? "contained" : "outlined"}
            color="primary"
            onClick={(e) => {
              setToggle(!toggle);
              selectRelationship("many-to-many");
            }}
          >
            Many-to-Many
          </MuiButton>
        </ButtonGroup>
      </Box>
      : null }
      <Modal
        isOpen={displayForm}
        onClosed={() => setDisplayForm(false)}
        toggle={() => setDisplayForm(false)}
      >
        <ModalHeader toggle={() => setDisplayForm(false)}>
          Створити таблицю
        </ModalHeader>
        <ModalBody>
          <form className="form">
            <label className="stretch">
              Назва таблиці:
              <Input value={tableInfo.name} type="text" name="table_name" onInput={
                e => setTableInfo({...tableInfo, name: e.target.value})
              } placeholder="Введіть назву таблиці..." />
            </label>
            { 
              new Array(fieldsLength).fill(0).map((el, i) => <div className="item" key={`field_${i}`} >
                <div className="removeButton">
                  <button type="button" className="btn-close" aria-label="Delete" onClick={(e) => removeField(i)}></button>
                </div>
                <div>
                  <label className="form-check-label" htmlFor={`name_${i}`}>
                    Назва поля:
                  </label>
                  <Input id={`name_${i}`} value={tableInfo[`field_${i}`]?.name} type="text" name={`field_${i}`} onInput={e => setTableInfo(
                    {...tableInfo, fields: changeField(tableInfo.fields, `field_${i}`, { name: e.target.value })}
                  )} placeholder="Введіть назву поля..." />
                </div>
                <div>
                  <label className="form-check-label" htmlFor={`select_${i}`}>
                    Тип:
                  </label>
                  <select name="select" id={`select_${i}`} className="form-select" onChange={(e) => changeField(tableInfo.fields, `field_${i}`, { type: e.target.value })} value={tableInfo[`field_${i}`]?.type}>
                    {datatypes.map(dt => <option value={dt} key={dt}>{dt}</option>)}
                  </select>
                </div>
                <div>
                  <input className="form-check-input" name="unique" type="checkbox" checked={tableInfo[`field_${i}`]?.unique} onChange={
                    (e) => changeField(tableInfo.fields, `field_${i}`, { uniqueClicked: true })
                  } id={`unique_${i}`}></input>
                  <label className="form-check-label" htmlFor={`unique_${i}`}>
                    UNIQUE
                  </label>
                </div>
                <div>
                  <input className="form-check-input" name="not_null" type="checkbox" checked={tableInfo[`field_${i}`]?.not_null} onChange={
                    (e) => changeField(tableInfo.fields, `field_${i}`, { notNullClicked: true })
                  } id={`not_null_${i}`}></input>
                  <label className="form-check-label" htmlFor={`not_null_${i}`}>
                    NOT NULL
                  </label>
                </div>
                <div>
                  <input className="form-check-input" name="pk" type="checkbox" checked={tableInfo[`field_${i}`]?.pk} onChange={
                    (e) => changeField(tableInfo.fields, `field_${i}`, { pkClicked: true })
                  } id={`pk_${i}`}></input>
                  <label className="form-check-label" htmlFor={`pk_${i}`}>
                    Primary key (PK)
                  </label>
                </div>
              </div>)
            }
            <Button
              color="primary"
              onClick={(e) => {
                addField(e);
              }}
              outline
              size="sm"
            >
              Додати поле
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              addTable(e, tableInfo);
              setDisplayForm(false);
              setTableInfo({
                name: '',
                fields: [],
              });
              setFieldsLength(1);
            }}
          >
            Додати
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}