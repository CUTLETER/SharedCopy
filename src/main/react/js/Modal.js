import React from 'react';
import './Modal.module.css';

function Modal({ isVisible, onClose, title, children }) {
    if (!isVisible) return null;

    return (
        <div className="">
            <div className="modal">
                <button className="modalContent" onClick={onClose}> &times; </button>
                <div className="modalHeader">
                    <h1>{title}</h1>
                </div>
                {/*<div className="modal-body">*/}
                {/*    {children}*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

export default Modal;
