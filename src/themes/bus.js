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
  textSettings: {
    lineHeight: 1,
    fontSize: 8,
    letterSpacing: -0.5,
    wordSpacing: 1,
    fontFamily: '"MTA R211 Overhead", monospace',
    padding: 2,
    linesPerSlide: 4,
    slideNumberFormat: "\u00A0>{current} of {total}"
  },
  Container: styled.div`
    width: 100vw;
    height: 100vh;
  `,

  Wall: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: black;
  `,

  ScreenContainer: styled.div`
    position: absolute;
    z-index: 0;
    width: calc(100% - ${scale(4)}rem);
    height: calc(100% - ${scale(4)}rem);
  `,

  Screen: styled.div`
    position: absolute;
    z-index: 1;
    width: calc(100% - ${scale(6)}rem);
    height: calc(100% - ${scale(6)}rem);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #000;
  `,

  TextContainer: styled.div`
    text-transform: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
    position: relative;
  `,

  TextAndMetadata: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: normal;
    height: 100%;
    text-transform: uppercase;
  `,

  TitleWrapper: styled.div`
    overflow: hidden;
    max-height: ${(props) => {
      const settings = props.theme.textSettings;

      const textHeight =
        settings.fontSize * settings.lineHeight * settings.linesPerSlide;
      const paddingHeight = settings.padding * 2 * settings.linesPerSlide;
      const marginHeight =
        settings.linesPerSlide > 1 ? (settings.linesPerSlide - 1) * 1 : 0;

      return `${scale(textHeight + paddingHeight + marginHeight)}rem`;
    }};
  `,

  LoadingText: styled.div`
    font-size: ${(props) => scale(props.theme.textSettings?.fontSize)}rem;
    color: rgba(255, 255, 255, 0.25);
    font-family: ${(props) => props.theme.textSettings?.fontFamily};
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: normal;
    animation: pulse 2s ease-in-out infinite;
    text-transform: uppercase;
    margin-top: ${scale(-0.75)}rem;

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
    font-size: ${(props) => scale(props.theme.textSettings?.fontSize * 0.4)}rem;
    color: rgba(255, 255, 255, 0.25);
    font-family: ${(props) => props.theme.textSettings?.fontFamily};
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: normal;
  `,

  Text: styled.div`
    background-color: transparent;
    display: inline-block;
    font-size: ${(props) => scale(props.theme.textSettings?.fontSize)}rem;
    letter-spacing: ${(props) =>
      scale(props.theme.textSettings?.letterSpacing)}rem;
    word-spacing: ${(props) => scale(props.theme.textSettings?.wordSpacing)}rem;
    color: rgba(255, 149, 0, 1);
    font-family: ${(props) => props.theme.textSettings?.fontFamily};
    font-weight: normal;
    padding: ${(props) => scale(props.theme.textSettings?.padding)}rem 0;
    margin-bottom: ${scale(1)}rem;
    line-height: ${(props) => props.theme.textSettings?.lineHeight};
    text-transform: uppercase;
    text-shadow: 0 0 100px rgba(255, 149, 0, 0.75);

    &:last-child {
      margin-bottom: 0;
    }
  `,

  Metadata: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  `,

  Description: styled.div`
    font-size: ${(props) => scale(props.theme.textSettings?.fontSize * 0.4)}rem;
    letter-spacing: ${(props) =>
      scale(props.theme.textSettings?.letterSpacing * 0.2)}rem;
    color: rgba(255, 149, 0, 0.5);
    font-family: ${(props) => props.theme.textSettings?.fontFamily};
    font-style: normal;
    display: inline-block;
    margin-top: ${scale(1)}rem;
  `,

  ProgressBar: styled.div`
    width: ${scale(24)}rem;
    height: ${scale(3)}rem;
    overflow: hidden;
    margin-top: ${scale(1)}rem;
    border: ${scale(0.25)}rem solid rgba(255, 149, 0, 0.25);
  `,

  ProgressFill: styled.div`
    height: calc(100% - ${scale(1)}rem);
    background-color: rgba(255, 149, 0, 0.25);
    width: calc(${(props) => props.progress}% - ${scale(1)}rem);
    transition: width 0.1s linear;
    margin: ${scale(0.5)}rem;
  `
};
