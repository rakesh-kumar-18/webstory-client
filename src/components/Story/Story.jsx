/* eslint-disable react/prop-types */
import styles from "./story.module.css";
import editIcon from "../../assets/editIcon.png";
import { Link } from "react-router-dom";

const Story = (props) => {
  const id = props.isBookmark ? props.story.slides[0]._id : props.story._id;

  if (props.story.slides.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div
        onClick={() => {
          props.handleStoryViewer(id, props.isBookmark);
        }}
        className={styles.categoryStory}
        style={{
          backgroundImage: `
            linear-gradient(to top, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 50%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 20%, rgba(0, 0, 0, 0) 50%),
            url(${props.story.slides[0].imageUrl})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.categoryStoryHeader}>
          {props.story.slides[0].header}
        </div>
        <div className={styles.categoryStoryDescription}>
          {props.story.slides[0].description}
        </div>
      </div>

      {props.story.postedBy === localStorage.getItem("userId") && (
        <button className={styles.editBtn}>
          <Link
            to={`?editstory=true&id=${props.story._id}`}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <div className={styles.editBtnContainer}>
              <img src={editIcon} alt="edit-icon" />
              <p> Edit</p>
            </div>
          </Link>
        </button>
      )}
    </div>
  );
};

export default Story;
