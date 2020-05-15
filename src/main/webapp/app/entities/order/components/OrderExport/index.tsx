import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Input, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pikaday from 'pikaday';

import { IRootState } from 'app/shared/reducers';
import { exportOrder } from '../../order.reducer';
import moment from 'moment';
import { AUTHORITIES } from 'app/config/constants';

export interface IOrderExportProps extends StateProps, DispatchProps {
  open: boolean;
  setExportdialog: Function;
}

export const OrderExportDialog = (props: IOrderExportProps) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const linkRef: any = createRef();
  const isAdmin = props.account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = props.account.authorities.includes(AUTHORITIES.BANK);
  const userId = isAdmin || isBank ? null : props.account.id;

  const exportOrders = () => {
    props.exportOrder(fromDate, toDate, userId);
  };

  useEffect(() => {
    if (props.ordersSheet && props.open) {
      const href = URL.createObjectURL(props.ordersSheet);
      const fileLink = linkRef.current;
      fileLink.download = 'orders.xlsx';
      fileLink.href = href;
      fileLink.click();
      fileLink.href = '';
      props.setExportdialog(false);
    }
  }, [props.ordersSheet]);

  useEffect(() => {
    const settings = {
      yearRange: 100,
      format: 'YYYY-MM-DD',
      keyboardInput: false
    };

    if (props.open) {
      const fromDateField = document.getElementById('fromDate');
      const toDateField = document.getElementById('toDate');

      const fromDatePicker = new Pikaday({
        field: fromDateField,
        onSelect(date) {
          fromDateField.nodeValue = date.toString();
          setFromDate(date);
        },
        ...settings
      });

      const toDatePicker = new Pikaday({
        field: toDateField,
        onSelect(date) {
          toDateField.nodeValue = date.toString();
          setToDate(date);
        },
        ...settings
      });

      fromDateField.parentNode.insertBefore(fromDatePicker.el, fromDateField.nextSibling);
      toDateField.parentNode.insertBefore(toDatePicker.el, toDateField.nextSibling);
    }
  }, [props.open]);

  return (
    <Modal isOpen={props.open}>
      <ModalHeader>Select dates, please</ModalHeader>
      <ModalBody id="">
        <Row>
          <Col>
            <Label for="fromDate">From</Label>
            <Input id="fromDate" type="text" className="form-control position-relative" value={moment(fromDate).format('LL')} />
          </Col>
          <Col>
            <Label for="toDate">To</Label>
            <Input id="toDate" type="text" className="form-control position-relative" value={moment(toDate).format('LL')} />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => props.setExportdialog(false)}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-order" color="primary" onClick={() => exportOrders()}>
          <FontAwesomeIcon icon="download" />
          &nbsp; Export
        </Button>
      </ModalFooter>
      <a ref={linkRef} hidden></a>
    </Modal>
  );
};

const mapStateToProps = ({ order, authentication }: IRootState) => ({
  account: authentication.account,
  ordersSheet: order.ordersSheet,
  loading: order.loading
});

const mapDispatchToProps = {
  exportOrder
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrderExportDialog);
