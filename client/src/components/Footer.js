import React from "react";
import styled from "styled-components";
import { BiBookHeart } from "react-icons/bi";
import { useNavigate } from "react-router";

const Footer = () => {
  let navigate = useNavigate();
  const handleClick = () => {
    navigate("/about");
  };
  return (
    <>
      <Wrapper>
        <Div>
          <BookHeart size="0.1x" />
          <Button onClick={handleClick}>
            <Info>About</Info>
          </Button>
        </Div>
      </Wrapper>
    </>
  );
};
export default Footer;

const Wrapper = styled.footer`
  background-color: #00a676;
  height: 100px;
  width: 100vw;
  padding: 25px;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
`;

const BookHeart = styled(BiBookHeart)`
  color: #f7f9f9;
`;

const Div = styled.div`
  height: 50px;
  width: 100px;
  margin: 0 auto;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Info = styled.p`
  font-family: "Outfit", sans-serif;
  color: #f7f9f9;
  margin-top: 3px;
  font-size: 15px;
  margin-bottom: 3px;
  &:hover {
    cursor: pointer;
    color: #f3a712;
  }
`;
