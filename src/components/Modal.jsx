import SVG from "react-inlinesvg";
import icoClose from "../assets/ico-close.svg";

const Modal = ({ show, onClose, children, title }) => {
  return (
    <div className={`modal-overlay ${show ? "open" : ""}`}>
      <div className="modal">
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <span className="modal__close" onClick={onClose}>
            <SVG src={icoClose} width={30} height={30} />
          </span>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
