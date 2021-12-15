import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import Tippy from "@tippy.js/react";
import DropdownContent from "./DropdownContent";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "./Tippy.css";

const BookDetails = () => {
  const { volumeId } = useParams();
  //state variables
  const [bookDetails, setBookDetails] = React.useState(null);
  const [ariaExpanded, setAriaExpanded] = React.useState(null);

  //get individual book info
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/books/v1/volumes/${volumeId}?key=${process.env.REACT_APP_APIKEY}`
    )
      .then((res) => res.json())
      .then((info) => {
        setBookDetails(info);
      });
  }, [volumeId]);
  const author = bookDetails?.volumeInfo.authors[0];
  const bookThumbnail = bookDetails?.volumeInfo.imageLinks?.thumbnail;
  const category = bookDetails?.volumeInfo.categories?.[0];
  const description = bookDetails?.volumeInfo.description;
  const isbn = bookDetails?.volumeInfo.industryIdentifiers[1].identifier;
  const title = bookDetails?.volumeInfo.title;
  const avgGoogleRating = bookDetails?.volumeInfo.averageRating;
  return (
    <>
      {bookDetails?.volumeInfo && (
        <>
          <Organize>
            <H2>Book Details</H2>
            <Descrip>More info on this title.</Descrip>
          </Organize>
          <Wrapper>
            <Div1>
              <Category>{category}</Category>
              <Img src={bookThumbnail} alt="book cover" />
              <Isbn>ISBN: {isbn}</Isbn>
              <GRating>
                Average Google Rating: {avgGoogleRating}/5 stars
              </GRating>
              <Tippy
                interactive={true}
                placement="right"
                animation="fade"
                arrow={true}
                trigger="click"
                appendTo="parent"
                onMount={() => setAriaExpanded("true")}
                onHide={() => setAriaExpanded("false")}
                content={
                  <DropdownContent
                    volumeId={volumeId}
                    aria-expanded={ariaExpanded}
                    setAriaExpanded={setAriaExpanded}
                    onHide
                  />
                }
              >
                <Add aria-haspopup="true" aria-expanded={ariaExpanded}>
                  Add to Shelf
                </Add>
              </Tippy>
            </Div1>
            <Div2>
              <Title>{title}</Title>
              <Author>{author}</Author>
              <Description
                dangerouslySetInnerHTML={{ __html: description }}
              ></Description>
            </Div2>
          </Wrapper>
        </>
      )}
    </>
  );
};

export default BookDetails;
const Descrip = styled.p`
  margin-top: 5px;
  margin-bottom: 25px;
`;
const H2 = styled.h2`
  color: #00a676;
  margin-top: 30px;
`;
const Add = styled.button`
  border: none;
  border-radius: 15px;
  background-color: #00a676;
  margin-top: 10px;
  font-size: 18px;
  padding: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const Organize = styled.div`
  margin-left: 25%;
  max-width: fit-content;
`;

const Wrapper = styled.div`
  display: flex;
  margin-left: 25%;
  background-color: #f7f9f9;
`;
const Div1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
`;
const Div2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-left: 40px;
  max-width: 500px;
`;

const Category = styled.h3`
  font-family: "Outfit", sans-serif;
  color: black;
  font-size: 20px;
  margin-bottom: 5px;
  max-width: 200px;
`;
const Img = styled.img`
  height: 300px;
  max-width: 200px;
`;
const Title = styled.h2`
  color: black;
  font-style: italic;
  font-family: "Poppins", sans-serif;
`;
const Author = styled.p`
  font-family: "Outfit", sans-serif;
  margin-top: 10px;
`;
const Isbn = styled.p`
  font-family: "Outfit", sans-serif;
  margin-top: 10px;
`;
const GRating = styled.p`
  font-family: "Outfit", sans-serif;
  margin-top: 10px;
`;

const Description = styled.div`
  font-family: "Poppins", sans-serif;
  margin-top: 10px;
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 100px;
`;
