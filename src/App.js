import React from "react";
import styled from "styled-components";

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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  user-select: none;
`;

const Text = styled.div`
  font-size: 8rem;
  letter-spacing: -1rem;
  color: rgb(49, 44, 4);
  font-family: "NYCTA-R46";
  background-color: rgba(255, 255, 0, 1);
  mix-blend-mode: overlay;
  display: inline-block;
  padding: 2rem;
`;

function App() {
  return (
    <Wall>
      <Screen>
        <TextContainer>
          <Text>Ride the</Text>
          <Text>Fun Computer</Text>
          <Text>Club Line</Text>
        </TextContainer>
      </Screen>
      <ScreenContainer></ScreenContainer>
    </Wall>
  );
}

export default App;
