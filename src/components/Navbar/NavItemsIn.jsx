import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./navbar.module.css";
import avatar from "../../assets/avatar.png";
import hamburger from "../../assets/hamburger.png";
import cross from "../../assets/cross.png";
import bookmarkIcon from "../../assets/bookmarkIcon.png";

const NavItemsIn = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchParams] = useSearchParams();
  const isBookmarksActive = searchParams.get("viewbookmarks");

  return (
    <>
      <Link to="/?viewbookmarks=true" style={{ textDecoration: "none" }}>
        <button
          style={{
            border: isBookmarksActive
              ? "3px solid #085cff"
              : "3px solid transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.2rem",
          }}
          className={styles.bookmarkBtn}
        >
          <img
            src={bookmarkIcon}
            alt="Bookmark Icon"
            style={{ width: "20px", height: "20px" }}
          />
          Bookmarks
        </button>
      </Link>
      <Link
        to={
          isBookmarksActive
            ? "/?viewbookmarks=true&addstory=true"
            : "/?addstory=true"
        }
      >
        <button className={styles.addStoryBtn}>Add Story</button>
      </Link>
      <img className={styles.avatar} src={avatar} alt="avatar" />
      <img
        className={`${styles.toggleIcon} ${
          showMenu ? styles.cross : styles.hamburger
        }`}
        onClick={() => setShowMenu(!showMenu)}
        src={showMenu ? cross : hamburger}
        alt={showMenu ? "cross" : "hamburger"}
      />
      {showMenu && (
        <div className={styles.menuSection}>
          <p>{localStorage.getItem("username")}</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("userId");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default NavItemsIn;
