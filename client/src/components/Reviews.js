import React, { useEffect } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { keyframes } from "styled-components";
import { FiLoader } from "react-icons/fi";

const Reviews = () => {
  let navigate = useNavigate();
  const { user } = useAuth0();
  const [reviews, setReviews] = React.useState(null);

  //hook to get reviews authored by the currently signed in user
  useEffect(() => {
    console.log(user.email, "user"); // works
    fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews);
      });
  }, []);

  const handleRedirect = (e, param) => {
    e.preventDefault();
    navigate(`/book/${param}`);
  };

  return (
    <Wrapper>
      <H2>Reviews</H2>
      <Description>
        View your reviews, collated here, for your convenience.
      </Description>
      {reviews ? (
        reviews.map((item) => {
          return (
            <Container>
              <Box1>
                <Button onClick={(e) => handleRedirect(e, item.id)}>
                  <Img src={item.thumbnail} alt="book cover" />
                </Button>
              </Box1>
              <Box2>
                <Button onClick={(e) => handleRedirect(e, item.id)}>
                  <Title>{item.title}</Title>
                </Button>
                <Rating>
                  <strong>Your rating: </strong> {item.rating}/10
                </Rating>
                <Review>{item.review}</Review>
              </Box2>
            </Container>
          );
        })
      ) : (
        <Loader></Loader>
      )}
    </Wrapper>
  );
};

export default Reviews;
const Wrapper = styled.div`
  margin-left: 25%;
`;
const Description = styled.p`
  margin-top: 5px;
  margin-bottom: 25px;
`;
const H2 = styled.h2`
  color: #00a676;
  margin-top: 30px;
`;
const Button = styled.button`
  border: none;
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
`;
const Container = styled.div`
  display: flex;
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

const Title = styled.p`
  font-size: 19px;
  margin-bottom: 10px;
  font-weight: bolder;
  font-style: italic;
  color: black;
`;

const Rating = styled.p`
  margin-bottom: 6px;
`;
const Review = styled.p`
  line-height: 1.3;
`;
const Img = styled.img``;

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
  margin-left: 35%;
  margin-top: 30px;
  margin-bottom: 30px;
  color: #00a676;
`;
