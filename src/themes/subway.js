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

export const subwayTheme = {
  name: "subway",
  Container: styled.div`
    width: 100vw;
    height: 100vh;
  `,

  Wall: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #cfc29a;
  `,

  ScreenContainer: styled.div`
    position: absolute;
    z-index: 0;
    width: calc(100% - ${scale(4)}rem);
    height: calc(100% - ${scale(4)}rem);
    background: linear-gradient(
      to bottom,
      rgb(181, 164, 111),
      rgb(110, 99, 68)
    );
    margin: ${scale(2)}rem;
    border-radius: ${scale(8)}rem;
    box-shadow: inset 0 ${scale(-1)}rem ${scale(2)}rem ${scale(0.5)}rem
        rgb(255, 248, 218),
      inset 0 0 ${scale(1)}rem ${scale(0.5)}rem rgb(117, 93, 22),
      inset 0 0 ${scale(2)}rem ${scale(0.5)}rem rgb(38, 28, 0),
      inset 0 ${scale(2)}rem ${scale(2)}rem ${scale(0.5)}rem rgb(126, 107, 45),
      inset 0 ${scale(-1)}rem ${scale(2)}rem ${scale(0.25)}rem
        rgb(229, 224, 195),
      0 0 ${scale(4)}rem ${scale(2)}rem rgb(235, 220, 163);
    filter: blur(${scale(0.75)}rem);
  `,

  Screen: styled.div`
    position: absolute;
    z-index: 1;
    width: calc(100% - ${scale(9)}rem - ${scale(8)}rem);
    height: calc(100% - ${scale(9)}rem - ${scale(8)}rem);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #6a6648;
    border-radius: ${scale(5)}rem;
    box-shadow: inset 0 ${scale(2)}rem ${scale(5)}rem ${scale(0.25)}rem
        rgba(0, 0, 0, 0.75),
      inset 0 0 ${scale(10)}rem rgba(0, 0, 0, 0.25),
      0 0 ${scale(1)}rem rgba(0, 0, 0, 0.75);
    overflow: hidden;
    filter: blur(${scale(1)}px);
    padding: ${scale(4)}rem;
  `,

  TextContainer: styled.div`
    text-transform: uppercase;
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
    mix-blend-mode: overlay;
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
    /* 4 lines max height, calculated from: 4 * ${scale(
      7.25
    )}rem (font-size) * 1.5 (line-height) */
    max-height: ${scale(43.5)}rem;
  `,

  LoadingText: styled.div`
    font-size: ${scale(6)}rem;
    color: rgb(255, 255, 255);
    font-family: "NYCTA-R46";
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-left: ${scale(1.25)}rem;
    margin-top: ${scale(-1)}rem;
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
    color: rgb(255, 255, 255);
    font-family: "NYCTA-R46";
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding-left: ${scale(1.25)}rem;
    margin-top: ${scale(-1)}rem;
  `,

  Text: styled.div`
    background-color: rgba(255, 255, 0, 1);
    display: inline-block;
    font-size: ${scale(7)}rem;
    letter-spacing: ${scale(-1.25)}rem;
    word-spacing: ${scale(-2.5)}rem;
    color: rgb(49, 44, 4);
    font-family: "NYCTA-R46";
    padding: ${scale(3)}rem;
    margin-bottom: ${scale(-3)}rem;

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
  `,

  Description: styled.div`
    font-size: ${scale(3)}rem;
    letter-spacing: ${scale(-0.25)}rem;
    color: rgb(255, 255, 255);
    font-family: "NYCTA-R46";
    mix-blend-mode: overlay;
    display: inline-block;
    margin-top: ${scale(1)}rem;
  `,

  ProgressBar: styled.div`
    width: ${scale(24)}rem;
    height: ${scale(3)}rem;
    background-color: rgba(0, 0, 0, 0.25);
    overflow: hidden;
    margin-top: ${scale(1)}rem;
  `,

  ProgressFill: styled.div`
    height: calc(100% - ${scale(1)}rem);
    background-color: rgba(255, 255, 255, 0.5);
    width: calc(${(props) => props.progress}% - ${scale(1)}rem);
    transition: width 0.1s linear;
    margin: ${scale(0.5)}rem;
  `
};
