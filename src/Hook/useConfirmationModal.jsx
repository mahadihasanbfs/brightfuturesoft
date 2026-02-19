// useConfirmationModal.js
import { useState } from 'react';
import DeleteModal from './DeleteModal';


const useConfirmationModal = () => {
      const [isVisible, setIsVisible] = useState(false);
      const [deleteCallback, setDeleteCallback] = useState(() => () => { });

      const showConfirmation = (callback) => {
            setDeleteCallback(() => callback);
            setIsVisible(true);
      };

      const handleCancel = () => {
            setIsVisible(false);
      };

      const handleConfirm = () => {
            deleteCallback();
            setIsVisible(false);
      };

      const ConfirmationModal = () => {
            if (!isVisible) return null;

            return (
                  <DeleteModal
                        status={isVisible}
                        setStatus={setIsVisible}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                  />
            );
      };

      return {
            showConfirmation,
            ConfirmationModal,
      };
};

export default useConfirmationModal;
