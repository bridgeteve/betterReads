import React from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

const DropdownContent = ({ volumeId }) => {
  const { user } = useAuth0();
  const [currentlyReading, setCurrentlyReading] = React.useState([]);

  //connect to endpoint send to DB
  const pushToCurrentlyReading = () => {
    fetch("/api/currentlyreading", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        volumeId,
        email: user.email,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setCurrentlyReading(json);
      });
  };

  const pushToTBR = () => {
    fetch("/api/tbr", {
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
  const pushToRead = () => {
    fetch("/api/read", {
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
  const pushToFavs = () => {
    fetch("/api/favorites", {
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

  //have something happen on click

  return (
    <>
      <Div>
        <Button onClick={pushToCurrentlyReading}>Currently Reading</Button>
        <Button onClick={pushToTBR}>To Be Read</Button>
        <Button onClick={pushToRead}>Read</Button>
        <Button onClick={pushToFavs}>Favorites</Button>
      </Div>
    </>
  );
};

export default DropdownContent;

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
