import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

// Function to normalize special characters to basic ASCII
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[éèêë]/g, "e")
    .replace(/[àáâä]/g, "a")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    .replace(/[ýÿ]/g, "y")
    .replace(/[š]/g, "s")
    .replace(/[ž]/g, "z")
    .replace(/[č]/g, "c")
    .replace(/[ř]/g, "r")
    .replace(/[ť]/g, "t")
    .replace(/[ď]/g, "d")
    .replace(/[ň]/g, "n")
    .replace(/[ľ]/g, "l")
    .replace(/[ĺ]/g, "l")
    .replace(/[ŕ]/g, "r")
    .replace(/[ó]/g, "o")
    .replace(/[ú]/g, "u")
    .replace(/[á]/g, "a")
    .replace(/[í]/g, "i")
    .replace(/[é]/g, "e")
    .replace(/[ý]/g, "y")
    .replace(/[ô]/g, "o")
    .replace(/[ä]/g, "a")
    .replace(/[ë]/g, "e")
    .replace(/[ï]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ü]/g, "u")
    .replace(/[ÿ]/g, "y");
};

const splitTextIntoLines = (text) => {
  // Normalize the text to remove special characters
  const normalizedText = normalizeText(text);
  const words = normalizedText.split(" ");
  let lines = [];
  let currentLine = [];
  let currentLineText = "";
  const textElement = document.createElement("span");
  textElement.className = "text-measure";
  textElement.style.fontSize = "7rem";
  textElement.style.letterSpacing = "-1.25rem";
  textElement.style.wordSpacing = "-2.5rem";
  textElement.style.fontFamily = "NYCTA-R46";
  textElement.style.textTransform = "uppercase";
  textElement.style.visibility = "hidden";
  textElement.style.position = "absolute";
  textElement.style.padding = "0 3rem 3rem 3rem";
  document.body.appendChild(textElement);
  const containerWidth =
    document.querySelector(".text-container-for-measure")?.offsetWidth || 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextLineText = currentLineText ? `${currentLineText} ${word}` : word;
    textElement.textContent = nextLineText;

    if (textElement.offsetWidth > containerWidth) {
      lines.push(currentLine.join(" "));
      currentLine = [word];
      currentLineText = word;
    } else {
      currentLine.push(word);
      currentLineText = nextLineText;
    }
  }

  lines.push(currentLine.join(" "));
  document.body.removeChild(textElement);
  return lines;
};

const splitHeadlineIntoSlides = (lines) => {
  const slides = [];
  const linesPerSlide = 4;

  for (let i = 0; i < lines.length; i += linesPerSlide) {
    slides.push(lines.slice(i, i + linesPerSlide));
  }

  return slides;
};

// Calculate timing based on character count
const calculateSlideDuration = (slide) => {
  const characterCount = slide.join(" ").length;
  // Base timing: 0.1 seconds per character, with min 2s and max 8s
  const baseDuration = characterCount * 0.1;
  const minDuration = 2000; // 2 seconds
  const maxDuration = 8000; // 8 seconds
  return Math.max(minDuration, Math.min(maxDuration, baseDuration * 1000));
};

const Wall = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #cfc29a;
`;

const ScreenContainer = styled.div`
  position: absolute;
  z-index: 0;
  width: calc(100% - 4rem);
  height: calc(100% - 4rem);
  background: linear-gradient(to bottom, rgb(181, 164, 111), rgb(110, 99, 68));
  margin: 2rem;
  border-radius: 8rem;
  box-shadow: inset 0 -1rem 2rem 0.5rem rgb(255, 248, 218),
    inset 0 0 1rem 0.5rem rgb(117, 93, 22), inset 0 0 2rem 0.5rem rgb(38, 28, 0),
    inset 0 2rem 2rem 0.5rem rgb(126, 107, 45),
    inset 0 -1rem 2rem 0.25rem rgb(229, 224, 195),
    0 0 4rem 2rem rgb(235, 220, 163);
  filter: blur(0.75rem);
`;

const Screen = styled.div`
  position: absolute;
  z-index: 1;
  width: calc(100% - 9rem - 8rem);
  height: calc(100% - 9rem - 8rem);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #6a6648;
  border-radius: 5rem;
  box-shadow: inset 0 2rem 5rem 0.25rem rgba(0, 0, 0, 0.75),
    inset 0 0 10rem rgba(0, 0, 0, 0.25), 0 0 1rem rgba(0, 0, 0, 0.75);
  overflow: hidden;
  filter: blur(1px);
  padding: 4rem;
`;

const TextContainer = styled.div`
  text-transform: uppercase;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  mix-blend-mode: overlay;
`;

const TextAndMetadata = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: normal;
  height: 100%;
`;

const TitleWrapper = styled.div`
  overflow: hidden;
  /* 4 lines max height, calculated from: 4 * 7.25rem (font-size) * 1.5 (line-height) */
  max-height: 43.5rem;
`;

const LoadingText = styled.div`
  font-size: 6rem;
  color: rgb(255, 255, 255);
  font-family: "NYCTA-R46";
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-left: 1.25rem;
  margin-top: -1rem;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ErrorText = styled.div`
  font-size: 3rem;
  color: rgb(255, 255, 255);
  font-family: "NYCTA-R46";
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-left: 1.25rem;
  margin-top: -1rem;
`;

const Text = styled.div`
  background-color: rgba(255, 255, 0, 1);
  display: inline-block;
  font-size: 7rem;
  letter-spacing: -1.25rem;
  word-spacing: -2.5rem;
  color: rgb(49, 44, 4);
  font-family: "NYCTA-R46";
  padding: 3rem;
  margin-bottom: -3rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Metadata = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 1.5rem 2rem;
`;

const Description = styled.div`
  font-size: 3rem;
  letter-spacing: -0.25rem;
  color: rgb(255, 255, 255);
  font-family: "NYCTA-R46";
  mix-blend-mode: overlay;
  display: inline-block;
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  width: 24rem;
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.25);
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled.div`
  height: calc(100% - 1rem);
  background-color: rgba(255, 255, 255, 0.5);
  width: calc(${(props) => props.progress}% - 1rem);
  transition: width 0.1s linear;
  margin: 0.5rem;
`;

function App() {
  const [headlines, setHeadlines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const textContainerRef = useRef(null);

  useLayoutEffect(() => {
    const splitAndUpdateLines = () => {
      if (textContainerRef.current && headlines[currentIndex]) {
        const newLines = splitTextIntoLines(headlines[currentIndex].title);
        const newSlides = splitHeadlineIntoSlides(newLines);
        setSlides(newSlides);
        setCurrentSlideIndex(0); // Reset to first slide when headline changes
      }
    };

    document.fonts.ready.then(() => {
      splitAndUpdateLines();
    });
  }, [headlines, currentIndex]);

  useEffect(() => {
    fetchHeadlines();
  }, []);

  useEffect(() => {
    if (headlines.length > 0) {
      const currentSlide = slides[currentSlideIndex] || [];
      const slideDuration = calculateSlideDuration(currentSlide);

      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          // If we have multiple slides for the current headline, advance to next slide
          if (slides.length > 1 && currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex((prevSlideIndex) => prevSlideIndex + 1);
            setProgress(0); // Reset progress when switching slides
            return prevIndex; // Stay on same headline
          } else {
            // Move to next headline and reset slide index
            setCurrentSlideIndex(0);
            setProgress(0); // Reset progress when switching headlines

            const nextIndex = prevIndex + 1;

            // If we've shown all headlines, fetch new ones
            if (nextIndex >= headlines.length) {
              setRefreshing(true);
              fetchHeadlines().finally(() => {
                setRefreshing(false);
              });
              return 0; // Reset to first headline
            }

            return nextIndex;
          }
        });
      }, slideDuration);

      return () => clearInterval(interval);
    }
  }, [headlines, slides, currentSlideIndex]);

  // Progress bar effect
  useEffect(() => {
    if (headlines.length > 0 && !loading && !error) {
      const currentSlide = slides[currentSlideIndex] || [];
      const slideDuration = calculateSlideDuration(currentSlide);

      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            return 0;
          }
          return prevProgress + 100 / (slideDuration / 100);
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [headlines, currentIndex, currentSlideIndex, loading, error, slides]);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use a CORS proxy to fetch the RSS feed
      const response = await fetch(
        "https://api.allorigins.win/get?url=" +
          encodeURIComponent(
            "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
          )
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.contents) {
        throw new Error("No RSS content received");
      }

      // Parse the XML content
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");

      // Check for parsing errors
      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) {
        throw new Error("Failed to parse RSS feed");
      }

      // Extract items from the RSS feed
      const items = xmlDoc.querySelectorAll("item");
      const parsedHeadlines = Array.from(items).map((item) => {
        const title = item.querySelector("title")?.textContent || "";
        const description =
          item.querySelector("description")?.textContent || "";
        const pubDate = item.querySelector("pubDate")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "";
        const creator =
          item.querySelector("dc\\:creator")?.textContent ||
          item.querySelector("creator")?.textContent ||
          "";

        return {
          title,
          description,
          pubDate,
          link,
          creator
        };
      });

      setHeadlines(parsedHeadlines);
      setCurrentIndex(0); // Reset to first headline
      setCurrentSlideIndex(0); // Reset slide index
      setProgress(0); // Reset progress
    } catch (err) {
      console.error("Error fetching headlines:", err);
      setError("Failed to load headlines");
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTimeString = (date) => {
    const now = new Date();
    const publishedDate = new Date(date);

    // Reset time to start of day for date comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const publishedDateOnly = new Date(
      publishedDate.getFullYear(),
      publishedDate.getMonth(),
      publishedDate.getDate()
    );

    const diffInDays = Math.floor(
      (nowDate - publishedDateOnly) / (1000 * 60 * 60 * 24)
    );

    // Always show time
    const timeString = publishedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    // Get relative date
    let dateString;
    if (diffInDays === 0) {
      dateString = "Today";
    } else if (diffInDays === 1) {
      dateString = "Yesterday";
    } else {
      // Show actual date format for older dates
      dateString = publishedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    }

    return `${dateString} at ${timeString}`;
  };

  const currentHeadline = headlines[currentIndex];
  const currentSlide = slides[currentSlideIndex] || [];

  if (!currentHeadline) {
    return (
      <Wall>
        <Screen>
          <TextContainer>
            {loading && <LoadingText>Loading</LoadingText>}
            {error && <ErrorText>Sorry, something went wrong</ErrorText>}
          </TextContainer>
        </Screen>
        <ScreenContainer />
      </Wall>
    );
  }

  const publishedTimeDate = getRelativeTimeString(currentHeadline.pubDate);
  const slideNumber =
    slides.length > 1 ? `${currentSlideIndex + 1}/${slides.length}` : null;

  return (
    <Wall>
      <Screen>
        <TextContainer
          ref={textContainerRef}
          className="text-container-for-measure"
        >
          {loading && <LoadingText>Loading</LoadingText>}
          {error && <ErrorText>{error}</ErrorText>}
          {refreshing && <LoadingText>Refreshing</LoadingText>}
          {!loading && !error && !refreshing && currentHeadline && (
            <TextAndMetadata>
              <TitleWrapper>
                {currentSlide.map((line, index) => (
                  <Text key={index}>{line}</Text>
                ))}
              </TitleWrapper>
              <br />
              <Metadata>
                <Description>
                  {publishedTimeDate}
                  {slideNumber && ` (${slideNumber})`}
                </Description>
                {!loading && !error && headlines.length > 0 && (
                  <ProgressBar>
                    <ProgressFill progress={progress} />
                  </ProgressBar>
                )}
              </Metadata>
            </TextAndMetadata>
          )}
        </TextContainer>
      </Screen>
      <ScreenContainer></ScreenContainer>
    </Wall>
  );
}

export default App;
