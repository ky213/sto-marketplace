import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IOrder } from 'app/shared/model/order.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from '../../order.reducer';

export const OrderExportDialog = ({ open, setExportdialog }: any) => {
  const exportOrders = () => {};

  return (
    <Modal isOpen={open}>
      <ModalHeader>Select dates, please</ModalHeader>
      <ModalBody id="">Date selection...</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setExportdialog(false)}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-order" color="primary" onClick={exportOrders}>
          <FontAwesomeIcon icon="download" />
          &nbsp; Export
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderExportDialog;
