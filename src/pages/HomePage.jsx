import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import FilterSection from "../components/FilterSection/FilterSection";
import CategorySection from "../components/CategorySection/CategorySection";
import RegisterModal from "../components/RegisterModal/RegisterModal";
import SignInModal from "../components/SignInModal/SignInModal";
import AddStory from "../components/AddStory/AddStory";
import MobileAddStory from "../components/MobileAddStory/MobileAddStory";
import StoryViewer from "../components/StoryViewer/StoryViewer";
import Slide from "../components/Slide/Slide";
import filters from "../constants/data";
import YourStories from "../components/YourStories/YourStories";
import Bookmarks from "../components/Bookmarks/Bookmarks";
import conf from "../conf/conf";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const displayParamMappings = {
    register: queryParams.get("register"),
    signin: queryParams.get("signin"),
    addstory: queryParams.get("addstory"),
    editstory: queryParams.get("editstory"),
    viewstory: queryParams.get("viewstory"),
    viewbookmarks: queryParams.get("viewbookmarks"),
    yourstories: queryParams.get("yourstories"),
    slide: queryParams.get("slide"),
  };

  const [authValidated, setAuthValidated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(["All"]);
  const [isBookmark, setIsBookmark] = useState(false);
  const [categoryStories, setCategoryStories] = useState({});

  const fetchCategoryStories = async (category) => {
    try {
      const response = await fetch(`${conf.backendUrl}/api/post/${category}`);
      if (response.ok) {
        const data = await response.json();
        setCategoryStories((prevState) => ({
          ...prevState,
          [category]: data.posts,
        }));
      } else {
        console.error("Failed to fetch category stories");
      }
    } catch (error) {
      console.error("Error fetching category stories:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const validateToken = async () => {
      try {
        const response = await fetch(`${conf.backendUrl}/api/auth/validate`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setAuthValidated(true);
        } else {
          setAuthValidated(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    validateToken();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [displayParamMappings.signin]);

  const handleSelectFilters = (filter) => {
    if (filter === "All") {
      setSelectedFilters(["All"]);
    } else {
      const updatedFilters = selectedFilters.includes("All")
        ? [filter]
        : selectedFilters.includes(filter)
          ? selectedFilters.filter((f) => f !== filter)
          : [...selectedFilters, filter];
      if (updatedFilters.length === 0) updatedFilters.push("All");
      setSelectedFilters(updatedFilters);
    }
  };

  const handleStoryViewer = (id, isBookmarkedStory) => {
    setIsBookmark(isBookmarkedStory);
    if (isBookmarkedStory)
      navigate(`/?viewbookmarks=true&viewstory=true&id=${id}`);
    else navigate(`/?viewstory=true&id=${id}`);
  };

  const renderCategorySections = () => {
    if (displayParamMappings.viewbookmarks) {
      return <Bookmarks handleStoryViewer={handleStoryViewer} />;
    } else if (displayParamMappings.yourstories) {
      return (
        <YourStories
          selectedFilters={selectedFilters}
          handleStoryViewer={handleStoryViewer}
          authValidated={authValidated}
          categoryStories={categoryStories}
        />
      );
    } else {
      return (
        <>
          <FilterSection
            selectedFilters={selectedFilters}
            handleSelectFilters={handleSelectFilters}
          />
          {!isMobile && (
            <YourStories
              selectedFilters={selectedFilters}
              handleStoryViewer={handleStoryViewer}
              authValidated={authValidated}
              categoryStories={categoryStories}
            />
          )}

          {selectedFilters.includes("All")
            ? filters
              .filter((filter) => filter.name !== "All")
              .map((filter) => (
                <CategorySection
                  key={filter.name}
                  category={filter.name}
                  handleStoryViewer={handleStoryViewer}
                  onStoryChange={fetchCategoryStories}
                  categoryStories={categoryStories[filter.name] || []}
                />
              ))
            : selectedFilters.map((filter) => (
              <CategorySection
                key={filter}
                category={filter}
                authValidated={authValidated}
                handleStoryViewer={handleStoryViewer}
                onStoryChange={fetchCategoryStories}
                categoryStories={categoryStories[filter] || []}
              />
            ))}
        </>
      );
    }
  };

  return (
    <>
      <Navbar authValidated={authValidated} />
      {renderCategorySections()}

      {displayParamMappings.register && <RegisterModal />}
      {displayParamMappings.signin && <SignInModal />}

      {displayParamMappings.addstory &&
        (isMobile ? (
          <MobileAddStory onStoryChange={fetchCategoryStories} />
        ) : (
          <AddStory onStoryChange={fetchCategoryStories} />
        ))}
      {displayParamMappings.editstory &&
        (isMobile ? (
          <MobileAddStory onStoryChange={fetchCategoryStories} />
        ) : (
          <AddStory onStoryChange={fetchCategoryStories} />
        ))}
      {displayParamMappings.viewstory && (
        <StoryViewer isBookmark={isBookmark} isMobile={isMobile} />
      )}

      {displayParamMappings.slide && <Slide />}
    </>
  );
};

export default HomePage;
