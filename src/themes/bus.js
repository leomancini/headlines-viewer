import styled from "styled-components";

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

export const busTheme = {
  name: "bus",
  Container: styled.div`
    width: 100vw;
    height: 100vh;
  `,

  Wall: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5dc;
  `,

  ScreenContainer: styled.div`
    position: absolute;
    z-index: 0;
    width: calc(100% - ${scale(4)}rem);
    height: calc(100% - ${scale(4)}rem);
    background: linear-gradient(to bottom, #8b4513, #654321);
    margin: ${scale(2)}rem;
    border-radius: ${scale(2)}rem;
    box-shadow: inset 0 ${scale(1)}rem ${scale(3)}rem ${scale(0.5)}rem
        rgba(0, 0, 0, 0.3),
      0 ${scale(2)}rem ${scale(4)}rem rgba(0, 0, 0, 0.2);
  `,

  Screen: styled.div`
    position: absolute;
    z-index: 1;
    width: calc(100% - ${scale(6)}rem);
    height: calc(100% - ${scale(6)}rem);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff8dc;
    border-radius: ${scale(1)}rem;
    box-shadow: inset 0 ${scale(1)}rem ${scale(2)}rem ${scale(0.25)}rem
      rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: ${scale(4)}rem;
  `,

  TextContainer: styled.div`
    text-transform: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
  `,

  TextAndMetadata: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: normal;
    height: 100%;
  `,

  TitleWrapper: styled.div`
    overflow: hidden;
    max-height: ${scale(43.5)}rem;
  `,

  LoadingText: styled.div`
    font-size: ${scale(6)}rem;
    color: #8b4513;
    font-family: "Times New Roman", serif;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: bold;
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
  `,

  ErrorText: styled.div`
    font-size: ${scale(3)}rem;
    color: #8b4513;
    font-family: "Times New Roman", serif;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: bold;
  `,

  Text: styled.div`
    background-color: transparent;
    display: inline-block;
    font-size: ${scale(7)}rem;
    letter-spacing: ${scale(-0.5)}rem;
    word-spacing: ${scale(0.5)}rem;
    color: #2f2f2f;
    font-family: "Times New Roman", serif;
    font-weight: bold;
    padding: ${scale(2)}rem;
    margin-bottom: ${scale(1)}rem;
    line-height: 1.2;

    &:last-child {
      margin-bottom: 0;
    }
  `,

  Metadata: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: ${scale(1.5)}rem ${scale(2)}rem;
    border-top: ${scale(0.25)}rem solid #8b4513;
  `,

  Description: styled.div`
    font-size: ${scale(3)}rem;
    letter-spacing: ${scale(0.1)}rem;
    color: #8b4513;
    font-family: "Times New Roman", serif;
    font-style: italic;
    display: inline-block;
    margin-top: ${scale(1)}rem;
  `,

  ProgressBar: styled.div`
    width: ${scale(24)}rem;
    height: ${scale(3)}rem;
    background-color: rgba(139, 69, 19, 0.2);
    overflow: hidden;
    margin-top: ${scale(1)}rem;
    border: ${scale(0.1)}rem solid #8b4513;
  `,

  ProgressFill: styled.div`
    height: calc(100% - ${scale(0.2)}rem);
    background-color: #8b4513;
    width: calc(${(props) => props.progress}% - ${scale(0.2)}rem);
    transition: width 0.1s linear;
    margin: ${scale(0.1)}rem;
  `
};
