import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './order.reducer';

export interface IOrderDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const OrderCancelDialog = (props: IOrderDeleteDialogProps) => {
  const handleClose = () => {
    props.history.push('/order');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmCencel = () => {
    props.cancelEntity(props.match.params.id);
  };

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm Cancel operation</ModalHeader>
      <ModalBody id="exchangeApp.order.delete.question">Are you sure you want to Cancel this Order?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="arrow-left" />
          &nbsp; Back
        </Button>
        <Button id="jhi-confirm-delete-order" color="danger" onClick={confirmCencel}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; OK
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ order, authentication }: IRootState) => ({
  orderEntity: order.entity,
  updateSuccess: order.updateSuccess,
  account: authentication.account
});

const mapDispatchToProps = { getEntity, cancelEntity: deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancelDialog);
