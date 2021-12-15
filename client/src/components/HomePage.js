import React from "react";
import styled from "styled-components";
//import components
import Book from "./Book";
import { BiBookHeart } from "react-icons/bi";
import { keyframes } from "styled-components";

const HomePage = ({ getBooks }) => {
  const [numItems, setNumItems] = React.useState(9);
  const handleClick = () => {
    setNumItems(numItems + 9);
  };
  return (
    <>
      <Div>
        <BookDiv>
          {getBooks?.items ? (
            getBooks.items
              .slice(0, numItems ? numItems : getBooks.items.length)
              .map((book) => {
                const thumbnail = book.volumeInfo?.imageLinks?.thumbnail;
                const volumeId = book.id;
                return <Book thumbnail={thumbnail} volumeId={volumeId} />;
              })
          ) : (
            <>
              <Container>
                <H1>Welcome to betterReads</H1>
                <Holder>
                  <Logo size="0.2x" />
                </Holder>
                <GetStarted>Search for books to get started.</GetStarted>
              </Container>
            </>
          )}
          {getBooks?.items ? (
            <ButtonHolder>
              <LoadMore onClick={handleClick}>View More</LoadMore>
            </ButtonHolder>
          ) : (
            ""
          )}
        </BookDiv>
      </Div>
    </>
  );
};
export default HomePage;

const fadeIn = keyframes`
  from {
   opacity: 0
  }
  to {
    opacity: 1;
  }
  `;

const Div = styled.div`
  background: #f7f9f9;
`;
const BookDiv = styled.div`
  width: 750px;
  margin-left: 25%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;
  background: #f7f9f9;
  animation: ${fadeIn} 2s;
`;

const LoadMore = styled.button`
  border: none;
  color: #f7f9f9;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
  margin-top: 30px;
  background-color: #00a676;
  border-radius: 15px;
  padding: 15px;
  width: 187px;
  border: solid;
  border-width: medium;
  border-color: transparent;
  &:hover {
    background-color: #f7f9f9;
    color: #00a676;
    border: solid;
    border-color: #00a676;
    border-width: medium;
    cursor: pointer;
  }
`;

const ButtonHolder = styled.div`
  position: relative;
  background-color: #f7f9f9;
  width: 100%;
  height: 100%;
  margin: 0 auto;
`;

const H1 = styled.h1`
  color: #00a676;
  margin-bottom: 15px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  margin-top: 150px;
`;
const Logo = styled(BiBookHeart)`
  color: #00a676;
  margin-bottom: 15px;
`;

const Holder = styled.div`
  height: 50px;
`;

const GetStarted = styled.p`
  margin-top: 15px;
`;
