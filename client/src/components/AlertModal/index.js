

import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

const AlertModal = (props) => {

    const {show, title, body } = props
  const [modal, setModal] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const [keyboard, setKeyboard] = useState(true);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Modal isOpen={modal || show} toggle={toggle} backdrop={true} keyboard={keyboard}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>
          {body}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>OK</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AlertModal;