import React, { useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { BiBookHeart, BiSearchAlt2 } from "react-icons/bi";
import { useNavigate } from "react-router";

const Header = ({ setGetBooks, loginWithPopup, logout, user }) => {
  //regular variable
  let navigate = useNavigate();
  //state variables
  const [searchTerms, setSearchTerms] = React.useState(null);

  //functions:
  // 1. called when a search is performed
  const handleSearch = (e) => {
    e.preventDefault();
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=40&key=${process.env.REACT_APP_APIKEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setGetBooks(data);
      });
    handleHome();
  };
  //2. direct user to homepage
  const handleHome = () => {
    navigate("/");
  };

  return (
    <>
      <Wrapper>
        <Div>
          <BookIcon size="0.3x" />
          <HomeButton onClick={handleHome}>
            <H1>
              better<strong>Reads</strong>
            </H1>
          </HomeButton>
        </Div>
        <Div2>
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Search books"
              onChange={(e) => {
                setSearchTerms(e.target.value);
              }}
            ></Input>
            <Button type="submit">
              <Search />
            </Button>
          </form>
        </Div2>
        <div>
          {user ? (
            <AnotherButton onClick={logout}>Logout</AnotherButton>
          ) : (
            <AnotherButton onClick={loginWithPopup}>Sign In</AnotherButton>
          )}
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  background: #00a676;
  height: 86px;
  width: 100vw;
  padding: var(--padding-page) 18px;
`;
const Div = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
`;
const AnotherButton = styled.button`
  border: none;
  border-radius: 15px;
  background-color: #f7f9f9;
  color: #00a676;
  font-family: "Outfit", sans-serif;
  font-size: 15px;
  padding: 15px;
  width: 150px;
  border: solid;
  border-color: transparent;
  &:hover {
    border: solid;
    border-color: #f7f9f9;
    border-radius: 15px;
    color: #f7f9f9;
    background: transparent;
    cursor: pointer;
  }
`;
const Div2 = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
`;
const Input = styled.input`
  border: none;
  border-radius: 20px;
  width: 300px;
`;
const HomeButton = styled.button`
  background: transparent;
  border: none;
  &:hover {
    cursor: pointer;
  }
`;
const Search = styled(BiSearchAlt2)`
  position: relative;
  right: 46px;
  top: 6px;
`;
const H1 = styled.p`
  font-size: 40px;
  color: #f7f9f9;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const BookIcon = styled(BiBookHeart)`
  color: #f7f9f9;
`;
const Button = styled.button`
  border: none;
  background: transparent;
  color: #00a676;
`;
export default Header;
