/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./storyViewer.module.css";
import crossIcon from "../../assets/crossIcon.png";
import shareIcon from "../../assets/shareIcon.png";
import bookmarkIcon from "../../assets/bookmarkIcon.png";
import blueBookmarkIcon from "../../assets/blueBookmarkIcon.png";
import likeIcon from "../../assets/likeIcon.png";
import redLikeIcon from "../../assets/redLikeIcon.png";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";
import conf from "../../conf/conf";
import { IoMdDownload } from "react-icons/io";

const StoryViewer = (props) => {
  const navigate = useNavigate();
  const slideDuration = 5000;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [storyId, setStoryId] = useState(null);
  const [story, setStory] = useState(null);
  const [bookmarkStatus, setBookmarkStatus] = useState([]);
  const [linkCopiedStatus, setLinkCopiedStatus] = useState(false);
  const [likeCount, setLikeCount] = useState([]);
  const [likeStatus, setLikeStatus] = useState([]);
  const location = useLocation();
  const { fetchBookmarks } = props;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const storyIdValue = searchParams.get("id");
    setStoryId(storyIdValue);
  }, [location]);

  useEffect(() => {
    const fetchStoryDetails = async () => {
      if (storyId) {
        try {
          const URL = props.isBookmark
            ? `${conf.backendUrl}/api/slide/slideDetails/${storyId}`
            : `${conf.backendUrl}/api/post/postDetails/${storyId}`;
          const response = await fetch(URL);
          if (response.ok) {
            const data = await response.json();
            const slides = props.isBookmark ? [data.slide] : data.slides || [];
            setStory(slides);
            setLikeCount(slides.map((slide) => slide.likes.length));
            setLikeStatus(
              slides.map((slide) =>
                slide.likes.includes(localStorage.getItem("userId")),
              ),
            );
            setBookmarkStatus(slides.map(() => false));
          } else {
            console.error("Failed to fetch story details");
          }
        } catch (error) {
          console.error("Error while fetching story details:", error);
        }
      }
    };

    fetchStoryDetails();
  }, [storyId, props.isBookmark]);

  const slides = story || [];

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const response = await fetch(
          `${conf.backendUrl}/api/user/isBookmarked/${slides[currentSlideIndex]?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const newBookmarkStatus = [...bookmarkStatus];

          newBookmarkStatus[currentSlideIndex] = data.isBookmarked;
          setBookmarkStatus(newBookmarkStatus);
        } else {
          console.error("Bookmark status fetch failed");
        }
      } catch (error) {
        console.error("Error while fetching bookmark status:", error);
      }
    };

    fetchBookmarkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex, bookmarkStatus]);

  const handleNextSlide = () => {
    if (!slides?.length && !props.isBookmark)
      setCurrentSlideIndex(currentSlideIndex + 1);
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, slideDuration);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex]);

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleBookmark = async (slideIndex) => {
    try {
      const slideId = slides[slideIndex]._id;
      const endpoint = bookmarkStatus[slideIndex]
        ? "removeBookmark"
        : "addBookmark";
      const response = await fetch(`${conf.backendUrl}/api/user/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ slideId }),
      });

      if (response.ok) {
        const newBookmarkStatus = [...bookmarkStatus];
        newBookmarkStatus[slideIndex] = !bookmarkStatus[slideIndex];
        setBookmarkStatus(newBookmarkStatus);

        if (fetchBookmarks) {
          fetchBookmarks();
        }
      } else {
        navigate("/?signin=true");
        console.error("Bookmark action failed");
      }
    } catch (error) {
      console.error("Error while performing bookmark action:", error);
    }
  };

  const handleDownload = async (slideIndex) => {
    const slide = slides[slideIndex];
    const url = slide.imageUrl;

    try {
      const response = await fetch(url, {
        mode: "cors",
      });

      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);

      const fileExtension = isVideo(url) ? ".mp4" : ".jpg";
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = `slide_${slideIndex + 1}${fileExtension}`;

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(blobURL);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the media:", error);
    }
  };

  const handleLike = async (slideIndex) => {
    try {
      const slideId = slides[slideIndex]._id;
      const response = await fetch(`${conf.backendUrl}/api/user/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ slideId }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedCount = data.likeCount;

        const newLikeCount = [...likeCount];
        newLikeCount[slideIndex] = updatedCount;
        setLikeCount(newLikeCount);

        const updatedStatus = data.likeStatus;
        const newLikeStatus = [...likeStatus];
        newLikeStatus[slideIndex] = updatedStatus;
        setLikeStatus(newLikeStatus);
      } else {
        navigate("/?signin=true");
        console.error("Like action failed");
      }
    } catch (error) {
      console.error("Error while performing like action:", error);
    }
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setLinkCopiedStatus(true);

    setTimeout(() => {
      setLinkCopiedStatus(false);
    }, 1000);
  };

  const handleContainerClick = (event) => {
    const containerWidth = event.currentTarget.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const clickY = event.nativeEvent.offsetY;
    const clickPercentage = (clickX / containerWidth) * 100;

    if (clickY >= 75 && clickY <= 550) {
      if (clickPercentage <= 50) {
        handlePreviousSlide();
      } else {
        handleNextSlide();
      }
    }
  };

  const isVideo = (url) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url?.endsWith(ext));
  };

  const renderMedia = (slide) => {
    if (isVideo(slide?.imageUrl)) {
      return (
        <video
          key={currentSlideIndex}
          className={styles.categoryStoryMedia}
          src={slide?.imageUrl}
          autoPlay
          loop
          playsInline
          controls={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      );
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.storyViewerContainer}>
        {!props.isMobile && (
          <img
            onClick={handlePreviousSlide}
            src={leftArrow}
            alt="left arrow"
            className={styles.leftArrow}
          />
        )}
        <div className={styles.storyViewer}>
          <div className={styles.progressBarContainer}>
            {slides?.map((slide, index) => {
              const isCompleted = index <= currentSlideIndex;
              const isActive = index === currentSlideIndex;
              return (
                <div
                  key={index}
                  className={`${styles.progressBar} ${
                    isCompleted ? styles.progressBarCompleted : ""
                  } ${isActive ? styles.progressBarActive : ""}`}
                ></div>
              );
            })}
          </div>
          <div
            className={styles.categoryStory}
            onClick={(event) => handleContainerClick(event)}
            style={{
              backgroundImage: `
                linear-gradient(to top, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0) 50%),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 20%, rgba(0, 0, 0, 0) 50%),
                url(${slides?.[currentSlideIndex]?.imageUrl})
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {renderMedia(slides?.[currentSlideIndex])}
            {linkCopiedStatus && (
              <div className={styles.linkCopiedMsg}>
                Link copied to clipboard
              </div>
            )}
            <div className={styles.categoryStoryHeader}>
              {slides?.[currentSlideIndex]?.header}
            </div>
            <div className={styles.categoryStoryDescription}>
              {slides?.[currentSlideIndex]?.description}
            </div>
          </div>

          <img
            onClick={() => {
              if (props.isBookmark) {
                navigate(`/?viewbookmarks=true`);
              } else {
                navigate(`/`);
              }
            }}
            src={crossIcon}
            alt="cross icon"
            className={styles.crossIcon}
          />
          {!props.isBookmark && (
            <img
              onClick={() => {
                handleShare(currentSlideIndex);
              }}
              src={shareIcon}
              alt="share icon"
              className={styles.shareIcon}
            />
          )}
          <img
            onClick={() => handleBookmark(currentSlideIndex)}
            src={
              bookmarkStatus?.[currentSlideIndex]
                ? blueBookmarkIcon
                : bookmarkIcon
            }
            alt="bookmark icon"
            className={styles.bookmarkIcon}
          />
          <IoMdDownload
            onClick={() => handleDownload(currentSlideIndex)}
            className={styles.downloadIcon}
            size={28}
            color="white"
          />
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
            className={styles.likeIcon}
          >
            <img
              onClick={() => {
                handleLike(currentSlideIndex);
              }}
              src={likeStatus?.[currentSlideIndex] ? redLikeIcon : likeIcon}
              alt="like icon"
            />
            <p style={{ color: "white" }}>{likeCount?.[currentSlideIndex]}</p>
          </div>
        </div>
        {!props.isMobile && (
          <img
            onClick={handleNextSlide}
            src={rightArrow}
            alt="right arrow"
            className={styles.rightArrow}
          />
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
