/* eslint-disable react/prop-types */
import { Link, useSearchParams } from "react-router-dom";
import styles from "./modalContainer.module.css";
import modalCloseIcon from "../../assets/modalCloseIcon.jpg";

const ModalContainer = (props) => {
  const [searchParams] = useSearchParams();
  const isBookmarksActive = searchParams.get("viewbookmarks");
  const isYourStoryActive = searchParams.get("yourstories");

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>{props.children}</div>
        <Link
          to={
            isBookmarksActive
              ? "/?viewbookmarks=true"
              : isYourStoryActive
                ? "/?yourstories=true"
                : "/"
          }
        >
          <img
            className={styles.modalCloseIcon}
            src={modalCloseIcon}
            alt="modal-close-icon"
          />
        </Link>
      </div>
    </div>
  );
};

export default ModalContainer;
