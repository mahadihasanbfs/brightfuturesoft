import { ConfirmView } from './ConfirmView';

// Delete confirmation used by the Meetings, Issues, Jobs, Blogs and Applications pages (same props as before).
// It is drawn with the site's custom confirmation dialog, so it matches the dark and light dashboard.
const DeleteModal = ({ OpenModal, setOpenModal, setIsDelete }) => {
      if (!OpenModal) return null;
      const dark = !document.querySelector('.dash-light, .public-site');
      return (
            <ConfirmView
                  title="Delete this item?"
                  message="It will be removed permanently and cannot be restored."
                  confirmText="Delete"
                  tone="danger"
                  dark={dark}
                  onConfirm={() => { setOpenModal(false); setIsDelete(true); }}
                  onCancel={() => { setOpenModal(false); setIsDelete(false); }}
            />
      );
};

export default DeleteModal;
