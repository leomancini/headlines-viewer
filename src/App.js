import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getCurrentTheme } from "./themes";

// Function to get scale factor from URL parameter
const getScaleFactor = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const scale = urlParams.get("scale");
  return scale ? parseFloat(scale) : 1;
};

// Function to apply scale to a value
const scale = (value) => {
  const scaleFactor = getScaleFactor();
  return value * scaleFactor;
};

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
  textElement.style.fontSize = `${scale(7)}rem`;
  textElement.style.letterSpacing = `${scale(-1.25)}rem`;
  textElement.style.wordSpacing = `${scale(-2.5)}rem`;
  textElement.style.fontFamily = "NYCTA-R46";
  textElement.style.textTransform = "uppercase";
  textElement.style.visibility = "hidden";
  textElement.style.position = "absolute";
  textElement.style.padding = `0 ${scale(3)}rem ${scale(3)}rem ${scale(3)}rem`;
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
  const location = useLocation();

  // Get current theme based on URL path
  const theme = getCurrentTheme(location.pathname);

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
        "https://whateverorigin.org/get?url=" +
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
      setError("Sorry, something went wrong");
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
      <theme.Container>
        <theme.Wall>
          <theme.Screen>
            <theme.TextContainer>
              {loading && <theme.LoadingText>Loading</theme.LoadingText>}
              {error && <theme.ErrorText>{error}</theme.ErrorText>}
            </theme.TextContainer>
          </theme.Screen>
          <theme.ScreenContainer />
        </theme.Wall>
      </theme.Container>
    );
  }

  const publishedTimeDate = getRelativeTimeString(currentHeadline.pubDate);
  const slideNumber =
    slides.length > 1 ? `${currentSlideIndex + 1}/${slides.length}` : null;

  return (
    <theme.Container>
      <theme.Wall>
        <theme.Screen>
          <theme.TextContainer
            ref={textContainerRef}
            className="text-container-for-measure"
          >
            {loading && <theme.LoadingText>Loading</theme.LoadingText>}
            {error && <theme.ErrorText>{error}</theme.ErrorText>}
            {refreshing && <theme.LoadingText>Refreshing</theme.LoadingText>}
            {!loading && !error && !refreshing && currentHeadline && (
              <theme.TextAndMetadata>
                <theme.TitleWrapper>
                  {currentSlide.map((line, index) => (
                    <theme.Text key={index}>{line}</theme.Text>
                  ))}
                </theme.TitleWrapper>
                <br />
                <theme.Metadata>
                  <theme.Description>
                    {publishedTimeDate}
                    {slideNumber && ` (${slideNumber})`}
                  </theme.Description>
                  {!loading && !error && headlines.length > 0 && (
                    <theme.ProgressBar>
                      <theme.ProgressFill progress={progress} />
                    </theme.ProgressBar>
                  )}
                </theme.Metadata>
              </theme.TextAndMetadata>
            )}
          </theme.TextContainer>
        </theme.Screen>
        <theme.ScreenContainer></theme.ScreenContainer>
      </theme.Wall>
    </theme.Container>
  );
}

export default App;
