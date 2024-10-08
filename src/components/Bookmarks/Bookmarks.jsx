/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./bookmarks.module.css";
import Story from "../Story/Story";

const Bookmarks = (props) => {
  const { bookmarks, isLoading, handleStoryViewer } = props;
  const [maxStoriesInRow, setMaxStoriesInRow] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles.categoryContainer}>
        <div
          style={{
            textAlign: "center",
          }}
          className={styles.categoryHeader}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className={styles.categoryContainer}>
        <div
          style={{
            textAlign: "center",
          }}
          className={styles.categoryHeader}
        >
          You have no bookmarks.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryHeader}>Your Bookmarks</div>
      <div className={styles.categoryStories}>
        {bookmarks.slice(0, maxStoriesInRow).map((story, index) => (
          <Story
            key={index}
            story={story}
            authValidated={props.authValidated}
            handleStoryViewer={handleStoryViewer}
            isBookmark={true}
          />
        ))}
      </div>
      {!isMobile && maxStoriesInRow < bookmarks.length && (
        <button
          onClick={() =>
            setMaxStoriesInRow(
              maxStoriesInRow + 4 > bookmarks.length
                ? bookmarks.length
                : maxStoriesInRow + 4,
            )
          }
          className={styles.seemoreBtn}
        >
          See more
        </button>
      )}
    </div>
  );
};

export default Bookmarks;
