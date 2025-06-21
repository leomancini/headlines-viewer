import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";

const splitTextIntoLines = (text) => {
  const words = text.split(" ");
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
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const textContainerRef = useRef(null);

  useLayoutEffect(() => {
    const splitAndUpdateLines = () => {
      if (textContainerRef.current && headlines[currentIndex]) {
        const newLines = splitTextIntoLines(headlines[currentIndex].title);
        setLines(newLines);
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
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        setProgress(0); // Reset progress when switching headlines
      }, 5000); // Change headline every 5 seconds

      return () => clearInterval(interval);
    }
  }, [headlines]);

  // Progress bar effect
  useEffect(() => {
    if (headlines.length > 0 && !loading && !error) {
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            return 0;
          }
          return prevProgress + 100 / 50;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [headlines, currentIndex, loading, error]);

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
    } catch (err) {
      console.error("Error fetching headlines:", err);
      setError("Failed to load headlines");
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTimeString = (dateString) => {
    const now = new Date();
    const publishedDate = new Date(dateString);

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

    if (diffInDays === 0) {
      // Today - show time
      const timeString = publishedDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
      return `Today at ${timeString}`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }
  };

  const currentHeadline = headlines[currentIndex];

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

  return (
    <Wall>
      <Screen>
        <TextContainer
          ref={textContainerRef}
          className="text-container-for-measure"
        >
          {loading && <LoadingText>Loading Headlines...</LoadingText>}
          {error && <ErrorText>{error}</ErrorText>}
          {!loading && !error && currentHeadline && (
            <TextAndMetadata>
              <TitleWrapper>
                {lines.slice(0, 4).map((line, index) => (
                  <Text key={index}>{line}</Text>
                ))}
              </TitleWrapper>
              <br />
              <Metadata>
                <Description>{publishedTimeDate}</Description>
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
