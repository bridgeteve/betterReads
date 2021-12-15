import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import Tippy from "@tippy.js/react";
import DropdownContent from "./DropdownContent";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "./Tippy.css";

const Book = ({ thumbnail, volumeId }) => {
  const [ariaExpanded, setAriaExpanded] = React.useState(null);
  let navigate = useNavigate();
  const bookDetails = () => {
    navigate(`/book/${volumeId}`);
  };
  return (
    <Div>
      <div>
        {thumbnail ? (
          <>
            <SmallDiv>
              <ImgButton onClick={bookDetails}>
                <Img src={thumbnail} alt="book cover" />
              </ImgButton>
              <Tippy
                interactive={true}
                placement="right"
                animation="fade"
                arrow={true}
                trigger="click"
                appendTo="parent"
                onMount={() => setAriaExpanded("true")}
                onHide={() => setAriaExpanded("false")}
                id="123"
                content={
                  <DropdownContent
                    volumeId={volumeId}
                    aria-expanded={ariaExpanded}
                    setAriaExpanded={setAriaExpanded}
                  />
                }
              >
                <Button aria-haspopup="true" aria-expanded={ariaExpanded}>
                  Add to shelf
                </Button>
              </Tippy>
            </SmallDiv>
          </>
        ) : (
          ""
        )}
      </div>
    </Div>
  );
};

export default Book;

const Img = styled.img``;
const SmallDiv = styled.div`
  margin: 10px;
  padding: 40px;
  border: solid;
  border-radius: 15px;
  color: #c7e1d9;
  border-width: normal;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;
  max-height: 320px;
`;
const Div = styled.div``;
const Button = styled.button`
  border: none;
  background: #00a676;
  border-radius: 20px;
  color: #f7f9f9;
  font-size: 17px;
  padding: 5px;
  &:hover {
    cursor: pointer;
  }
`;

const ImgButton = styled.button`
  border: none;
  background: transparent;
  &:hover {
    cursor: pointer;
  }
`;
