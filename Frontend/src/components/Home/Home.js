import React, { useState } from 'react'
import './Home.css'
import { Button, Modal, Form } from 'react-bootstrap';
import ModalComponent from './ModalComponent';
const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const toggleContent = () => {
  };
  const handleLoginModalToggle = () => {
    setShowModal(!showModal);
    setIsLogin(true);
  };
  const handlesignupModalToggle = () => {
    setShowModal(!showModal);
    setIsLogin(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className='Main_Home_Container'>
        <Button onClick={handleLoginModalToggle} className='Login_btn'>Login</Button>
        <h3 className='text'>OR</h3>
        <Button onClick={handlesignupModalToggle} className='signup_btn'>SignUp</Button>



      </div>
      <ModalComponent show={showModal} onHide={handleModalClose} toggleContent={toggleContent} isLogin={isLogin} setIsLogin={setIsLogin} />

    </>
  )
}

export default Home