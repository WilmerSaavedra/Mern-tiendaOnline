import React, { useState,useEffect } from "react";
import { Modal } from "react-bootstrap";
export function Modals({ isOpen, closeModal, children }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  useEffect(() => {
    // Actualiza modalIsOpen cuando isOpen cambia
    setModalIsOpen(isOpen);
  }, [isOpen]);
  const close = () => {
    setModalIsOpen(false);
    closeModal(); 
  };
 
  return modalIsOpen ? (
    <Modal show={modalIsOpen} onHide={close} size="md" >
      <Modal.Body  style={{ backgroundColor: "rgba(247,247,248, 0.2)" }}>
      
        {children}
      </Modal.Body>
    </Modal>
  ) : null;
}


