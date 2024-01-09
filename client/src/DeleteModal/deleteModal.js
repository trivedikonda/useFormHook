import React from 'react';

import './deleteModal.css'

const DeleteModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <p className='delete-warning'>Are you sure you want to delete this user?</p>
          <div className='buttons-grp'>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>          </div>
        </div>
      </div>
    )
  );
};

export default DeleteModal;
