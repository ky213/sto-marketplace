import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getUser, deleteUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';

export interface IUserManagementDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ login: string }> {}

export const UserManagementDeleteDialog = (props: IUserManagementDeleteDialogProps) => {
  useEffect(() => {
    props.getUser(props.match.params.login);
  }, []);

  const handleClose = event => {
    event.stopPropagation();
    props.history.push('/admin/user-management');
  };

  const confirmDelete = event => {
    props.deleteUser(props.user.login);
    handleClose(event);
  };

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm delete operation</ModalHeader>
      <ModalBody>Are you sure you want to delete this User?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  user: storeState.userManagement.user
});

const mapDispatchToProps = { getUser, deleteUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementDeleteDialog);
