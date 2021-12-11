import React, { useEffect } from "react";
import styled from "styled-components";
import "./Sidebar.css";
import {
  BsBookshelf,
  BsBookmarkCheck,
  BsPeople,
  BsHouse,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "./Tippy.css";
import Tippy from "@tippy.js/react";
import UpdateDropdown from "./UpdateDropdown";
import { useAuth0 } from "@auth0/auth0-react";
import { keyframes } from "styled-components";
import { FiLoader } from "react-icons/fi";
require("dotenv").config();
const { API_KEY } = process.env;

const Sidebar = () => {
  const [ariaExpanded, setAriaExpanded] = React.useState(null);
  const [current, setCurrent] = React.useState([]);
  const [load, setLoad] = React.useState(false);
  const { user } = useAuth0();

  const pushCurrent = (param) => {
    //create empty array
    let CR = [];
    //iterate through param array and push each promise, which is resolved (line 32), to the array
    for (let i = 0; i < param.length; i++) {
      CR.push(
        fetch(
          `https://www.googleapis.com/books/v1/volumes/${param[i]}?key=AIzaSyCf0SpH3Or2vjVdpJZK5xsYz9pb6tS2kD8`
        )
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
      );
    }
    //only AFTER ALL promises are resolved do we reassign to a state variable
    Promise.all(CR).then((data) => {
      setCurrent(data);
    });
  };

  useEffect(() => {
    setLoad(true);
    user &&
      fetch("/api/currentlyreading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      })
        .then((res) => res.json())
        .then((info) => {
          pushCurrent(info.currentlyReading.currentlyReading);
        })
        .finally(() => {
          setLoad(false);
        });
  }, [user]);

  const volumeId = current[0]?.id;
  console.log(current[0], "huh");
  return (
    <Links>
      <Span>
        <NavLinky exact to="/">
          <HomeIcon /> Home
        </NavLinky>
      </Span>
      <Span>
        <NavLinky to="/social">
          <PeopleIcon /> Social
        </NavLinky>
      </Span>
      <Span>
        <NavLinky to="/shelves">
          <BookshelfIcon /> Bookshelves
        </NavLinky>
      </Span>
      <Span>
        <NavLinky to="/reviews">
          <Bookmark /> Reviews
        </NavLinky>
      </Span>
      <CurrentlyReading>
        <p>Currently Reading:</p>
        {load ? (
          <Loader></Loader>
        ) : (
          <div>
            {current.length > 0 && (
              <Img
                src={current[0]?.volumeInfo?.imageLinks.thumbnail}
                alt="cover"
              />
            )}
          </div>
        )}
        <Tippy
          content={<UpdateDropdown volumeId={volumeId} />}
          interactive={true}
          placement="right"
          animation="fade"
          arrow={true}
          trigger="click"
          appendTo="parent"
          onMount={() => setAriaExpanded("true")}
          onHide={() => setAriaExpanded("false")}
        >
          <UpdateButton aria-haspopup="true" aria-expanded={ariaExpanded}>
            Update Progress
          </UpdateButton>
        </Tippy>
      </CurrentlyReading>
    </Links>
  );
};

export default Sidebar;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  width: 250px;
  position: absolute;
  top: 120px;
  background-color: #f7f9f9;
`;
const UpdateButton = styled.button`
  border: none;
  background-color: #00a676;
  border-radius: 15px;
  color: #f7f9f9;
  font-size: 15px;
  margin-top: 4px;
  &:hover {
    cursor: pointer;
  }
`;
const NavLinky = styled(NavLink)`
  text-decoration: none;
  font-family: "Outfit", sans-serif;
  font-weight: thin;
  font-size: 20px;
  margin-left: 40px;
  padding: 9px;
  :visited {
    color: black;
  }
  &.active {
    background-color: #c7e1d9;
    border-radius: 20px;
    font-weight: bold;
  }
  &:hover {
    cursor: pointer;
    background-color: #c7e1d9;

    border-radius: 20px;
    font-weight: bold;
  }
`;
const Img = styled.img`
  max-height: 200px;
  margin-top: 3px;
`;
const CurrentlyReading = styled.div`
  border: solid;
  border-radius: 15px;
  border-color: #00a676;
  border-width: thin;
  margin-left: 40px;
  padding: 10px;
  max-height: 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Span = styled.span`
  margin-top: 10px;
  margin-bottom: 25px;
`;
const HomeIcon = styled(BsHouse)`
  margin-right: 20px;
`;

const PeopleIcon = styled(BsPeople)`
  margin-right: 20px;
`;
const BookshelfIcon = styled(BsBookshelf)`
  margin-right: 20px;
`;
const Bookmark = styled(BsBookmarkCheck)`
  margin-right: 20px;
`;
const Button = styled.button`
  border-radius: 20px;
  background-color: #00a676;
  border: none;
  padding: 10px;
  color: white;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 20px;
  margin-left: 40px;
  width: 200px;
`;
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
  `;
const Loader = styled(FiLoader)`
  animation: ${rotate} 2s infinite;
  font-size: 40px;
  margin-left: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
  color: #00a676;
`;
