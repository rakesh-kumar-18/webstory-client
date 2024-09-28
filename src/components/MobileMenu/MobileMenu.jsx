/* eslint-disable react/prop-types */
import styles from "./mobileMenu.module.css";
import avatar from "../../assets/avatar.png";
import { Link, useSearchParams } from "react-router-dom";
import bookmarkIcon from "../../assets/bookmarkIcon.png";

const MobileMenu = (props) => {
  const [searchParams] = useSearchParams();
  const isBookmarksActive = searchParams.get("viewbookmarks");
  const isYourStoryActive = searchParams.get("yourstories");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <>
      {props.authValidated ? (
        <div className={styles.mobileMenuSectionIn}>
          <div>
            <img className={styles.avatar} src={avatar} alt="avatar" />
            <p>{localStorage.getItem("username")}</p>
          </div>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?yourstories=true"
          >
            <button>Your Story</button>
          </Link>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to={
              isBookmarksActive
                ? "/?viewbookmarks=true&addstory=true"
                : isYourStoryActive
                  ? "/?yourstories=true&addstory=true"
                  : "/?addstory=true"
            }
          >
            <button>Add Story</button>
          </Link>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?viewbookmarks=true"
            style={{ textDecoration: "none" }}
          >
            <button
              className={styles.bookmarkBtn}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.2rem",
              }}
            >
              <img
                src={bookmarkIcon}
                alt="Bookmark Icon"
                style={{ width: "20px", height: "20px" }}
              />
              Bookmarks
            </button>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className={styles.mobileMenuSectionOut}>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?register=true"
          >
            <button className={styles.registerBtn}>Register</button>
          </Link>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?signin=true"
          >
            <button className={styles.signinBtn}>Sign in</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
