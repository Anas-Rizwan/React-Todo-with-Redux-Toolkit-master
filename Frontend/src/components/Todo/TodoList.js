import React, { useState, useEffect } from 'react';
import './Todo.css'
import { useDispatch } from 'react-redux';
import { addItem, deleteItem, editItem, completeItem, PostTodo, VerifyUser, LogoutUser, GetTodo } from '../../store/slices/UserSlice';
import { useSelector } from 'react-redux';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
function TodoList() {
  const item = useSelector((state) => state.todos)
  const { data } = item.Todos
  window.localStorage.setItem('todo', JSON.stringify(data))
  console.log('item', data);


  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [UserInfo, setUserInfo] = useState({})
  const [Usertodo, setUsertodo] = useState([])
  const [todos, settodos] = useState("");
  const [complete, setcomplete] = useState(false);
  const [toggle, settoggle] = useState(false);
  const [edit, setedit] = useState(null);
  const [Completevalue, setCompletevalue] = useState({});


  // useEffect(() => {
  //   (async () => {
  //     const todoitem = await dispatch(GetTodo())
  //     console.log('todoitem', todoitem);
  //   })()
  // }, [])


  const handlelogout = () => {
    (async () => {
      try {
        const response = await dispatch(LogoutUser())
        window.localStorage.setItem('isloggedin', response.payload.valid)
        window.localStorage.clear()
        window.location.href = window.location.href;
      } catch (error) {
        console.log('err---', error);
      }
    })()
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(GetTodo())

    const Action = await dispatch(PostTodo({ todos, user_id }))
    if (!todos) {
      alert(Action.payload.EmptyField);
    }
    else if (Action.payload.status === 'Success') {
      console.log("Post ", Action.payload.status);
    } else {
      alert("Action.payload.Error", Action.payload.status);
    }
    if (!todos) {
      alert("Plz Fill The Field")
    }
    else if (todos && toggle) {
      console.log("todos", todos);

      settoggle(false)

      console.log("toggletttt");
      dispatch(editItem({
        id: edit,
        text: todos,
        isComplete: false,
      }))
    }

    else {
      const todoitem = JSON.parse(window.localStorage.getItem('todo'))
      const { data } = todoitem
      setUsertodo(todoitem)
      console.log('todoitem>>>>>', todoitem);
      console.log('todoitem data>>>>>', data);
      // dispatch(addItem({
      //   id: Math.floor(Math.random() * 1000),
      //   text: todos,
      //   isComplete: false,
      // }))
      // console.log("add id", id);
      // )

    }
    settodos('');
  };




  const updateTodo = (val) => {
    let newItem = item.Todos.find((elem) => {
      console.log("elem update id", elem.id);
      return elem.id === val.id
    })
    console.log("val update id", val.id);

    settodos(newItem.text)
    settoggle(true)
    setedit(val.id)

  };

  const removeTodo = id => {
    console.log("delete id", id);
    dispatch(deleteItem({ id: id }))

  };

  const completeTodo = value => {
    dispatch(completeItem({
      id: value.id,
      text: value.text,
    }))
  };

  const handleChange = e => {
    settodos(e.target.value);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await dispatch(VerifyUser())
        if (res.payload.status === 'success') {

          setUserInfo(res.payload)
          window.localStorage.setItem('token', res.payload.token)
          window.localStorage.setItem('isloggedin', res.payload.valid)
          navigate('/Todolist')
        }
        else {
          navigate('/')
        }
      } catch (error) {
        console.log('err>>>>>', error)
      }
    })()
  }, [])

  const { user_id, username } = UserInfo
  return (
    <>
      <div className='todo-app'>
        <button onClick={handlelogout} className='todo-button edit'>
          Logout
        </button>
        <form onSubmit={handleSubmit} className='todo-form'>
          {toggle ? (
            <>
              <h1>Update Plan for Today?</h1>
              <input
                placeholder='Update your item.Todos'
                value={todos}
                onChange={handleChange}
                name='text'

                className='todo-input edit'
              />
              <button onClick={handleSubmit} className='todo-button edit'>
                Update
              </button>
            </>
          ) : (
            <>
              <h1>What's the Plan for Today?</h1>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', }}>
                <h1>{username}</h1>

              </div>
              <input
                placeholder='Add a todo'
                value={todos}
                onChange={handleChange}
                name='text'
                className='todo-input'

              />
              <button onClick={handleSubmit} className='todo-button' style={{ backgroundColor: 'red', }}>
                Add todo
              </button>
            </>
          )}
        </form>
        {
          Usertodo.map((todo, id) => (
            // val.map((todo, id) => (
            <div
              className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
              key={id}
            >
              <div key={todo.id} style={{ cursor: 'pointer' }} onClick={() => completeTodo(todo)}>
                <h3>{todo.todos}</h3>
              </div>
              {todo.isComplete ?
                "" :
                <div className='icons'>
                  <RiCloseCircleLine
                    onClick={() => removeTodo(todo.id)}
                    className='delete-icon'
                  />
                  <TiEdit
                    onClick={() => updateTodo(todo)}
                    className='edit-icon'
                  />
                </div>
              }
            </div>
            // ))

          )
          )
        }
      </div >

    </>
  );
}

export default TodoList;
