import React, { useEffect, createRef } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IOrder } from 'app/shared/model/order.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from '../../order.reducer';
import axios from 'axios';

export const OrderExportDialog = ({ open, setExportdialog }: any) => {
  const linkRef: any = createRef();

  const exportOrders = async () => {
    const res = await axios(
      'http://localhost:8080/api/orders/export?beginDateParam=2020-01-12T01:00:00.147Z&endDateParam=2020-06-12T23:00:00.147Z',
      {
        responseType: 'blob'
      }
    );
    const href = URL.createObjectURL(res.data);
    const fileLink = linkRef.current;
    fileLink.download = 'orders.xlsx';
    fileLink.href = href;
    fileLink.click();
    fileLink.href = '';
    setExportdialog(false);
  };

  return (
    <Modal isOpen={open}>
      <ModalHeader>Select dates, please</ModalHeader>
      <ModalBody id="">Date selection...</ModalBody>
      <a ref={linkRef} hidden>
        orders
      </a>
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
