import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { useState } from 'react';
import { datatypes} from './../helpers/datatypes';

export function DbManagementBar({currentModel, addTable}) {
  const [displayForm, setDisplayForm] = useState(false);
  let [fieldsLength, setFieldsLength] = useState(1);
  const [tableInfo, setTableInfo] = useState({
    name: '',
    fields: [],
  });

  const showForm = (e) => {
    e.preventDefault();
    setDisplayForm(true);
  };

  const addField = (e) => {
    e.preventDefault();
    setFieldsLength(++fieldsLength);
  };

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
        unique: false, 
        not_null: false, 
        pk: false
      },
    ];
  }

  return (
    <div>
      { currentModel !== 'main' ? <button onClick={showForm}>Add table</button> : null }
      { displayForm ? 
        <form>
          <label>
            Db name:
            <input value={tableInfo.name} type="text" name="table_name" onInput={e => setTableInfo({...tableInfo, name: e.target.value})} />
          </label>
          { 
            new Array(fieldsLength).fill(0).map((el, i) => <div key={`field_${i}`} >
              <label>
                Field {i}:
                <input value={tableInfo[`field_${i}`]?.name} type="text" name={`field_${i}`} onInput={e => setTableInfo(
                  {...tableInfo, fields: changeField(tableInfo.fields, `field_${i}`, { name: e.target.value })}
                )} />
              </label>
              <label>
                Type {i}:
                <select name="select" onChange={(e) => changeField(tableInfo.fields, `field_${i}`, { type: e.target.value })}>
                  {datatypes.map(dt => <option value={dt} selected={tableInfo[`field_${i}`]?.type === dt}>{dt}</option>)}
                </select>
              </label>
              <label>
                Is unique {i}?:
                <input name="unique" type="checkbox" checked={tableInfo[`field_${i}`]?.unique} onChange={
                  (e) => changeField(tableInfo.fields, `field_${i}`, { uniqueClicked: true })
                }></input>
              </label>
              <label>
                NOT NULL {i}?:
                <input name="not_null" type="checkbox" checked={tableInfo[`field_${i}`]?.not_null} onChange={
                  (e) => changeField(tableInfo.fields, `field_${i}`, { notNullClicked: true })
                }></input>
              </label>
              <label>
                Primary key {i}?:
                <input name="pk" type="checkbox" checked={tableInfo[`field_${i}`]?.pk} onChange={
                  (e) => changeField(tableInfo.fields, `field_${i}`, { pkClicked: true })
                }></input>
              </label>
            </div>)
          }
          <button onClick={addField}>Add field</button>
          <button onClick={(e) => {
            addTable(e, tableInfo);
            setDisplayForm(false);
          }}>Add</button>
        </form> 
      : null }
    </div>
  );
}