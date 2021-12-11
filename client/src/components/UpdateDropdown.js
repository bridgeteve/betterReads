import React from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

const UpdateDropdown = (volumeId) => {
  const { user } = useAuth0();
  const pushToRead = () => {
    fetch("/api/move", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        volumeId,
        email: user.email,
      }),
    }).then((res) => res.json());
  };

  return (
    <>
      <Div>
        <Button onClick={pushToRead}>I'm Done!</Button>
      </Div>
    </>
  );
};

export default UpdateDropdown;
const Div = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  border: none;
  background-color: #00a676;
  color: #f7f9f9;
  border-radius: 5px;
  margin: 4px;
  font-size: 15px;
  &:hover {
    cursor: pointer;
    background: transparent;
    border: solid;
    border-color: #00a676;
  }
  &:active {
    content: "✔️";
  }
`;
