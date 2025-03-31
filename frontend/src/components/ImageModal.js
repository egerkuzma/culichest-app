import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Указываем корневой элемент для модалки

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Image Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        content: {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          background: 'none',
          padding: '20px',
          inset: 'auto',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <img 
        src={imageSrc} 
        alt="Рецепт" 
        style={{ 
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }} 
      />
      <button 
        onClick={onClose} 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1001,
          background: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '24px',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'background-color 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
        onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
      >
        ×
      </button>
    </Modal>
  );
};

export default ImageModal;