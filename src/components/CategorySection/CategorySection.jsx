/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./categorySection.module.css";
import Story from "../Story/Story";

const CategorySection = (props) => {
  const [isMobile, setIsMobile] = useState(false);
  const [maxStoriesInRow, setMaxStoriesInRow] = useState(4);

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

  useEffect(() => {
    props.onStoryChange(props.category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.category]);

  const noStoriesAvailable = props.categoryStories.length === 0;

  return (
    <div
      className={styles.categoryContainer}
      style={{ marginBottom: noStoriesAvailable && "0px" }}
    >
      {!isMobile && (
        <div className={styles.categoryHeader}>
          Top Stories About {props.category}
        </div>
      )}
      <div className={styles.categoryStories}>
        {noStoriesAvailable ? (
          <div className={styles.noStoriesContainer}>
            <p className={styles.noStoriesMessage}>No stories available</p>
          </div>
        ) : (
          props.categoryStories
            .slice(0, maxStoriesInRow)
            .map((story, index) => (
              <Story
                key={index}
                story={story}
                authValidated={props.authValidated}
                handleStoryViewer={props.handleStoryViewer}
              />
            ))
        )}
      </div>
      {!isMobile &&
        !noStoriesAvailable &&
        maxStoriesInRow < props.categoryStories.length && (
          <button
            onClick={() =>
              setMaxStoriesInRow(
                maxStoriesInRow + 4 > props.categoryStories.length
                  ? props.categoryStories.length
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

export default CategorySection;
