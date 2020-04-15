import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IHomeCustomer } from 'app/shared/model/home-customer.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './home-customer.reducer';

export interface IHomeCustomerDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const HomeCustomerDeleteDialog = (props: IHomeCustomerDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/home-customer' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.homeCustomerEntity.id);
  };

  const { homeCustomerEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm delete operation</ModalHeader>
      <ModalBody id="exchangeApp.homeCustomer.delete.question">Are you sure you want to delete this HomeCustomer?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-homeCustomer" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ homeCustomer }: IRootState) => ({
  homeCustomerEntity: homeCustomer.entity,
  updateSuccess: homeCustomer.updateSuccess
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(HomeCustomerDeleteDialog);
