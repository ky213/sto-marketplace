import React, { createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { exportOrder } from '../../order.reducer';

export interface IOrderExportProps extends StateProps, DispatchProps {
  open: boolean;
  setExportdialog: Function;
}

export const OrderExportDialog = (props: IOrderExportProps) => {
  const linkRef: any = createRef();

  const exportOrders = () => {
    props.exportOrder(new Date('2019-01-01'), new Date(), 1);
  };

  useEffect(() => {
    if (props.ordersSheet) {
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
      <ModalBody id="">Date selection...</ModalBody>
      <a ref={linkRef} hidden>
        orders
      </a>
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
    </Modal>
  );
};

const mapStateToProps = ({ order }: IRootState) => ({
  ordersSheet: order.ordersSheet,
  loading: order.loading
});

const mapDispatchToProps = {
  exportOrder
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrderExportDialog);
