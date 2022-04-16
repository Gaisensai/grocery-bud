import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';


const getLocalStorage= ()=>{
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'));
  }else{
    return [];
  }
};

function App() {
const [input, setInput]= useState('');
const [isEditing, setIsEditing]= useState(false);
const [list, setList] = useState(getLocalStorage);
const [editID, setEditID] = useState(null);
const [alert, setAlert] = useState({show: false, msg: '', type: ''});

useEffect(()=>{
  localStorage.setItem('list', JSON.stringify(list));
}, [list]);

const showAlert = (show= false, type= '', msg= '' )=>{
   setAlert({show, type, msg});
};
const submitHandler = (e)=>{
  e.preventDefault();
 if(!input){
  showAlert(true,'danger', 'please enter value');
 }else if(input && isEditing){
  setList(
    list.map(item=>{
    if(item.id === editID){
      return {...item, title: input};
    }
    return item;
  }));
  setInput('');
  setIsEditing(false);
  showAlert(true, 'success', 'value changed');
 }else{
   showAlert(true, 'success', 'item added')
   const newItem = { id: new Date().getTime().toString(), title: input};
   setList([...list, newItem]);
   setInput('');
   console.log(input);
 }
};
  const clearListHandler = ()=>{
    showAlert(true, 'danger', 'List emptied');
    setList([]);
  };

  const removeItemHandler = (id)=>{
    showAlert(true, 'danger', 'item removed');
    setList(list.filter((item)=>{
      return item.id !== id;
    }));
  };

  const editItemHandler = (id)=>{
    const specificItem = list.find((item)=>item.id === id);
    setIsEditing(true);
    setEditID(id);
    setInput(specificItem.title);
  };


  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={submitHandler}>
        {alert.show && <Alert {...alert} removeAlert= {showAlert} list ={list} />}
        <h3>grocery bud</h3>
        <div className='form-control'>
          <input
           type='text' 
           className='grocery' 
           placeholder='e.g. eggs' 
           value ={input} 
           onChange= {(e)=>setInput(e.target.value)}/>
          <button type= 'submit' className='submit-btn'>{isEditing?'edit':'submit'}</button>
        </div>
      </form>
      <div className='grocery-container'>
        <List items= {list} removeItem={removeItemHandler} editItem={editItemHandler} />
        <button type='' className='clear-btn' onClick={clearListHandler}>clear items</button>
      </div>
    </section>
  );
}

export default App