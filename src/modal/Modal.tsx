import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <p>{content}</p>
          <button className="close" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>

  );
};

export default Modal;
