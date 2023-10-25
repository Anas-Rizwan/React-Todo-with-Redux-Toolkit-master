import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import { UserLogin, UserSignup } from '../../store/slices/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useHistory } from 'react-router-dom';


// axios.defaults.withCredentials = true

const ModalComponent = ({ show, onHide, isLogin, setIsLogin }) => {

    const dispatch = useDispatch();

    const navigate = useNavigate();
    // const history = useHistory;

    const [input, setinput] = useState({})
    const [Error, setError] = useState()

    const oninputchange = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value })
    }
    const handlesignup = async (e) => {
        e.preventDefault()
        const resultAction = await dispatch(UserSignup(input))
        if (!input.name || !input.email || !input.password) {
            alert(resultAction.payload.EmptyField);
            console.log(resultAction.payload);
        }
        else if (resultAction.payload.status === 'NameError') {
            alert(resultAction.payload.NameError);
        }
        else if (resultAction.payload.status === 'EmailError') {
            alert(resultAction.payload.EmailError);
        }
        else if (resultAction.payload.status === 'PasswordError') {
            alert(resultAction.payload.PasswordError);
        }
        else if (resultAction.payload.status === 'Success') {
            setIsLogin(true)
            setinput('')
        } else {
            setError(resultAction.payload.Error)
            console.log('errorr', resultAction.payload.Error);
        }
    }
    const handlelogin = async (e) => {
        e.preventDefault()

        const Action = await dispatch(UserLogin(input))
        if (!input.email || !input.password) {
            alert(Action.payload.EmptyField);
        }
        else if (Action.payload.status === 'Success') {
            console.log('token', Action.payload);
            navigate('/TodoList');
        } else {
            alert(Action.payload.Error);
        }
    }
    return (
        <Modal className='main_modal' show={show} onHide={onHide}>
            <Modal.Header closeButton >
                <Modal.Title>{isLogin ? 'Login' : 'Sign Up'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLogin ?

                    <Form >
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email Address"
                                autoFocus
                                name='email'
                                onChange={oninputchange}

                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label >Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                autoFocus
                                onChange={oninputchange}

                            />
                        </Form.Group>

                    </Form>
                    :
                    <Form >
                        {/* <h4>{Error}</h4> */}
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Name"
                                autoFocus
                                onChange={oninputchange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                autoFocus
                                onChange={oninputchange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label >Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                autoFocus
                                onChange={oninputchange}

                            />
                        </Form.Group>

                    </Form>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={isLogin ? handlelogin : handlesignup}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </Button>
                {/* <Button variant="link" onClick={toggleContent}>
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                </Button> */}
            </Modal.Footer>
        </Modal>
    )
}

export default ModalComponent