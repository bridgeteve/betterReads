import React from "react";
import styled from "styled-components";
import { BsPencilSquare } from "react-icons/bs";
import { useAuth0 } from "@auth0/auth0-react";
import { FiHeart } from "react-icons/fi";
import { useEffect } from "react/cjs/react.development";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "./Tippy.css";
import LikedBy from "./LikedBy";
import EachComment from "./EachComment";
import { useNavigate } from "react-router";

const SingleReview = (review) => {
  const reviewData = review.review;
  const { user } = useAuth0();
  const [ariaExpanded, setAriaExpanded] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [numLikes, setNumLikes] = React.useState(null);
  const [likers, setLikers] = React.useState(null);
  const [flag, setFlag] = React.useState(false);
  const [comment, setComment] = React.useState(null);
  const [theComment, setTheComment] = React.useState(null);
  const [existingComments, setExistingComments] = React.useState(null);
  const navigate = useNavigate();

  //check if currently signed in user has liked the review
  useEffect(() => {
    if (reviewData.likes.includes(user.email)) {
      setIsLiked(true);
    }
    setNumLikes(reviewData.likes.length);
    setLikers(reviewData.likes);
  }, []);

  //if the current user has already liked the tweet, remove from likes array. else, push to likes array
  const handleLike = (param) => {
    if (isLiked === false) {
      fetch(`/api/like/${param}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
        }),
      }).then((res) => res.json());
      setIsLiked(!isLiked);
      setNumLikes(numLikes + 1);
    } else {
      fetch(`/api/unlike/${param}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
        }),
      }).then((res) => res.json());
      setIsLiked(!isLiked);
      setNumLikes(numLikes - 1);
    }
  };

  //toggle flag to open and close comments box + get all existing comments on a review
  const handleClick = (e, param) => {
    e.preventDefault();
    setFlag(!flag);
    fetch(`/api/allComments/${param}`)
      .then((res) => res.json())
      .then((info) => {
        setExistingComments(info.result.comments);
      });
  };

  //send the new comment to the DB and set the comment to a state
  //variable to render it on the page after its submitted
  const handleComment = (e, param) => {
    e.preventDefault();
    fetch(`/api/comment/${param}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email,
        comment: comment,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTheComment(data.comment);
      });
  };

  const handleBookDetails = (e, param) => {
    e.preventDefault();
    navigate(`/book/${param}`);
  };

  return (
    <>
      <Container>
        <FlexBox>
          <Box1>
            <BookDetailsButton
              onClick={(e) => handleBookDetails(e, reviewData.id)}
            >
              <Img src={reviewData.thumbnail} alt="book cover" />
            </BookDetailsButton>
          </Box1>
          <Box2>
            <BookDetailsButton
              onClick={(e) => handleBookDetails(e, reviewData.id)}
            >
              <Title>{reviewData.title}</Title>
            </BookDetailsButton>
            <Rating>
              <strong>Rating: </strong> {reviewData.rating}/10
            </Rating>
            <Review>{reviewData.review}</Review>
            <By>Reviewed by: {reviewData.email}</By>
          </Box2>
        </FlexBox>
        <Box3>
          <Organize>
            <Button onClick={() => handleLike(reviewData.id)}>
              <Heart fill={isLiked ? "#00a676" : "transparent"} />
            </Button>
            <Tippy
              content={<LikedBy likers={likers} />}
              placement="right"
              animation="fade"
              interactive={true}
              arrow={true}
              trigger="click"
              appendTo="parent"
              onMount={() => setAriaExpanded("true")}
              onHide={() => setAriaExpanded("false")}
            >
              <LikedByButton aria-haspopup="true" aria-expanded={ariaExpanded}>
                <NumLikes>{numLikes}</NumLikes>
              </LikedByButton>
            </Tippy>
          </Organize>
          <Button>
            <Pencil onClick={(e) => handleClick(e, reviewData.id)} />
          </Button>
        </Box3>
        {flag ? (
          <>
            <CommentField>
              <form onSubmit={(e) => handleComment(e, reviewData.id)}>
                <CommentButton type="submit">Comment</CommentButton>
                <Input
                  type="text"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                ></Input>
              </form>
            </CommentField>
            <CommentBox>
              {theComment ? (
                <NewComment>
                  <Commenter>{user.email}: </Commenter>
                  <Comment>{theComment}</Comment>
                </NewComment>
              ) : (
                ""
              )}
              {existingComments
                ? existingComments.map((item) => {
                    const comment = item.comment;
                    const commenter = item.email;
                    return (
                      <EachComment comment={comment} commenter={commenter} />
                    );
                  })
                : ""}
            </CommentBox>
          </>
        ) : (
          ""
        )}
      </Container>
    </>
  );
};
export default SingleReview;

const Container = styled.div`
  border: solid;
  border-radius: 15px;
  border-color: #00a676;
  border-width: thin;
  padding: 10px;
  width: 790px;
  margin-bottom: 20px;
`;
const BookDetailsButton = styled.button`
  border: none;
  background-color: transparent;
  color: black;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const NewComment = styled.div`
  background-color: #00a676;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 15px;
  width: fit-content;
  max-width: 770px;
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
const CommentBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  font-size: 18px;
  width: 300px;
  height: 30px;
`;
const CommentButton = styled.button`
  background-color: #00a676;
  border: none;
  font-size: 18px;
  margin-right: 10px;
  padding: 5px;
  border-radius: 15px;
  &:hover {
    cursor: pointer;
  }
`;
const CommentField = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`;
const Box1 = styled.div``;
const Box2 = styled.div`
  margin-left: 15px;
`;
const Organize = styled.div`
  display: flex;
  align-items: center;
`;
const FlexBox = styled.div`
  display: flex;
  margin: 10px;
`;
const NumLikes = styled.p`
  position: relative;
  bottom: 4px;
  color: #00a676;
  font-size: 18px;
`;
const Button = styled.button`
  background-color: transparent;
  border: none;
  &:hover {
    cursor: pointer;
  }
`;
const Box3 = styled.div`
  display: flex;
  justify-content: space-around;
`;
const Pencil = styled(BsPencilSquare)`
  color: #00a676;
`;
const Heart = styled(FiHeart)`
  color: #00a676;
  margin-right: 10px;
`;
const Title = styled.p`
  font-size: 19px;
  margin-bottom: 10px;
  font-weight: bolder;
  font-style: italic;
`;

const Rating = styled.p`
  margin-bottom: 6px;
`;
const Review = styled.p`
  line-height: 1.3;
  margin-top: 15px;
`;
const Img = styled.img``;

const By = styled.p`
  margin-top: 10px;
`;

const LikedByButton = styled.button`
  background-color: transparent;
  border: none;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
