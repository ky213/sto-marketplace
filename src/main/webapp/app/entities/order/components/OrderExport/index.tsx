import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Label } from 'reactstrap';
import { AvForm, AvGroup } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

import { IRootState } from 'app/shared/reducers';
import { exportOrder } from '../../order.reducer';
import { AUTHORITIES } from 'app/config/constants';
import { DatePicker } from 'app/shared/components/DatePicker';

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

  return (
    <Modal isOpen={props.open}>
      <ModalHeader>Select dates, please</ModalHeader>
      <ModalBody id="">
        <AvForm>
          <Row>
            <AvGroup className="col-md-6">
              <Label for="fromDate">From</Label>
              <DatePicker id="fromDate" name="fromDate" value={moment(fromDate).format('LL')} setDate={(date: Date) => setFromDate(date)} />
            </AvGroup>
            <AvGroup className="col-md-6">
              <Label for="toDate">To</Label>
              <DatePicker id="toDate" name="toDate" value={moment(toDate).format('LL')} setDate={(date: Date) => setToDate(date)} />
            </AvGroup>
          </Row>
        </AvForm>
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
