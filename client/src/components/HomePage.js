import React from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
//import components
import Book from "./Book";
import { BiBookHeart } from "react-icons/bi";

const HomePage = ({ getBooks, setGetBooks }) => {
  //state variables
  const [searchTerms, setSearchTerms] = React.useState(null);
  console.log(getBooks);

  // const handleScroll = () => {
  //   fetch(
  //     `https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&start-index=10&maxResults=40&key=AIzaSyCf0SpH3Or2vjVdpJZK5xsYz9pb6tS2kD8`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setGetBooks(data);
  //     });
  // };

  return (
    <>
      <Div>
        {/* <InfiniteScroll
          dataLength={getBooks?.items.length}
          // next={handleScroll}
          hasMore={true}
        > */}
        <BookDiv>
          {getBooks?.items ? (
            getBooks.items.map((book) => {
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
        </BookDiv>
        {/* </InfiniteScroll> */}
      </Div>
    </>
  );
};
export default HomePage;

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
