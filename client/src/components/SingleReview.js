import React from "react";
import styled from "styled-components";
import { BsPencilSquare } from "react-icons/bs";
import { useAuth0 } from "@auth0/auth0-react";
import { FiHeart } from "react-icons/fi";
import { useEffect } from "react/cjs/react.development";

const SingleReview = (review) => {
  const reviewData = review.review;
  console.log(reviewData);
  const [isLiked, setIsLiked] = React.useState(false);
  const { user } = useAuth0();
  const [numLikes, setNumLikes] = React.useState(null);

  //check if currently signed in user has liked the review
  useEffect(() => {
    if (reviewData.likes.includes(user.email)) {
      setIsLiked(true);
    }
    setNumLikes(reviewData.likes.length);
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

  return (
    <>
      <Container>
        <FlexBox>
          <Box1>
            <Img src={reviewData.thumbnail} alt="book cover" />
          </Box1>
          <Box2>
            <Title>{reviewData.title}</Title>
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
            {numLikes > 0 ? <NumLikes>{numLikes}</NumLikes> : ""}
          </Organize>
          <Button>
            <Pencil />
          </Button>
        </Box3>
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
