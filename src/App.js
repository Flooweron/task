import React, { useState } from 'react'
import { MdSwapVert, MdPublishedWithChanges, MdDeleteForever } from "react-icons/md";
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import './App.css';

const initialValues = {
  name: '',
  value: ''
}

const defaultData = [
  {
    name: 'name1',
    value: 'value1'
  },
  {
    name: 'name2',
    value: 'value2'
  },
  {
    name: 'name3',
    value: 'value3'
  },
]

function App() {
  const [userData, setUserData] = useState(initialValues);
  const [users, setUsers] = useState(defaultData);
  const [editableUserData, setEditableUserData] = useState({
    isEdit: false,
    userIndex: null
  });

  const isFilledFields = userData.name && userData.value;

  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (isFilledFields) {
      if (editableUserData.isEdit) {
        const editedData = users;
        editedData.splice(editableUserData.userIndex, 1, userData);

        setUsers(editedData);

        setEditableUserData({
          isEdit: false,
          userIndex: null
        });
        setUserData(initialValues);
      } else {
        setUsers((prevState) => [...prevState, userData]);
        setUserData(initialValues);
      }
    }
  }

  const handleDragEnd = (results) => {
    if (!results.destination) return;
    let tempUser = [...users];
    let [selectedRow] = tempUser.splice(results.source.index, 1);
    tempUser.splice(results.destination.index, 0, selectedRow);
    setUsers(tempUser);
  };

  const handleRemoveClick = (index) => {
    setUsers(users.filter((user, userIndex) => userIndex !== index));
  };

  const hadleCleanClick = () => setUserData(initialValues);

  const handleEditClick = (data, index) => {
    setUserData(data);
    setEditableUserData({
      isEdit: true,
      userIndex: index
    });
  };

  return (
    <div className='wrapper'>
      <div className='wrapper-content'>
      <div className='wrapper-content__form'>
        <div className='form-content'>
            <h3>Добавить/изменить</h3>
            <form onSubmit={ handleSubmitUser } onReset={ hadleCleanClick }>
              <textarea placeholder="name" onChange={(e) => setUserData((prevState) => ({
                ...prevState,
                name: e.target.value
              }))}
              value={userData.name}></textarea>
              <textarea placeholder="value" onChange={(e) => setUserData((prevState) => ({
                ...prevState,
                value: e.target.value
              }))}
              value={userData.value}></textarea>
              <div className='buttons-wrapper'>
                <button type="reset" className='buttons-wrapper__reset'>очистить</button>
                <button disabled={!isFilledFields} type="submit" className='buttons-wrapper__add'>{editableUserData.isEdit ? 'сохранить' : 'добавить'}</button>
              </div>
            </form>
        </div>
      </div>
      <div className='table-data'>
        <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
        <table>
            <thead>
              <tr>
                <th>swap</th>
                <th>name</th>
                <th>value</th>
                <th className='th-actions'>actions</th>
              </tr>
            </thead>
            <Droppable droppableId="tbody">
              {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {users.map((user, index) => (
                  index+1,
                  <Draggable draggableId={user.name} index={index} key={user.name}>
                    {(provided) =>(
                        <tr ref={provided.innerRef} {...provided.draggableProps}>
                          <td {...provided.dragHandleProps} >
                              <MdSwapVert size={25} />
                          </td>
                          <td>{user.name}</td>
                          <td>{user.value}</td>
                          <td className='td-buttons'>
                            <div className='table-data__buttons'>
                              <MdPublishedWithChanges size={25}  onClick={() => handleEditClick(user, index)}/>
                              <MdDeleteForever size={25}  onClick={() => handleRemoveClick(index)} />
                            </div>
                          </td>
                        </tr>)}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
                )}
            </Droppable>
          </table>
        </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;
