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
import { useAuth0 } from "@auth0/auth0-react";
import { keyframes } from "styled-components";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const [current, setCurrent] = React.useState([]);
  const [load, setLoad] = React.useState(false);
  const { user } = useAuth0();
  const volumeId = current[0]?.id;
  const navigate = useNavigate();

  const pushCurrent = (param) => {
    //create empty array
    let CR = [];
    //iterate through param array and push each promise, which is resolved (line 32), to the array
    for (let i = 0; i < param.length; i++) {
      CR.push(
        fetch(
          `https://www.googleapis.com/books/v1/volumes/${param[i]}?key=${process.env.REACT_APP_APIKEY}`
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

  const pushToRead = () => {
    fetch("/api/move", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        volumeId: volumeId,
        email: user.email,
      }),
    });
    let change = current.filter((item) => {
      console.log(item.id);
      console.log(volumeId);
      return item.id !== volumeId;
    });
    console.log(change);
    setCurrent(change);
    return current;
  };
  const handleBookDetails = (e, param) => {
    e.preventDefault();
    navigate(`/book/${param}`);
  };
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
              <Button onClick={(e) => handleBookDetails(e, current[0]?.id)}>
                <Img
                  src={current[0]?.volumeInfo?.imageLinks.thumbnail}
                  alt="cover"
                />
              </Button>
            )}
          </div>
        )}
        <UpdateButton onClick={pushToRead}>I'm Done!</UpdateButton>
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
const Button = styled.button`
  border: none;
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
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
