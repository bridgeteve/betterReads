import React from "react";
import styled from "styled-components";

const EachComment = (comment, commenter) => {
  const blurb = comment.comment;
  const email = comment.commenter;
  console.log(comment, "why");
  return (
    <Div>
      <Commenter>{email}:</Commenter>
      <Comment>{blurb}</Comment>
    </Div>
  );
};

export default EachComment;

const Div = styled.div`
  background-color: #00a676;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 15px;
  max-width: fit-content;
`;
const Comment = styled.p`
  font-size: 17px;
  color: white;
`;
const Commenter = styled.p`
  font-size: 14px;
  color: white;
  margin-bottom: 5px;
  font-style: italic;
`;
