import React from "react";
import styled from "styled-components";
import { useEffect } from "react";

const FriendReview = ({ idOfFriend }) => {
  const [fren, setFren] = React.useState([]);

  //get reviews authored by a friend of yours
  useEffect(() => {
    fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: idOfFriend,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFren([...fren, data.reviews]);
      });
  }, []);

  return (
    <>
      <div>
        {fren.length >= 1
          ? fren[0].map((item) => {
              return (
                <Container>
                  <Box1>
                    <Img src={item.thumbnail} alt="book cover" />
                  </Box1>
                  <Box2>
                    <Title>{item.title}</Title>
                    <Rating>
                      <strong>Rating: </strong> {item.rating}/10
                    </Rating>
                    <Review>{item.review}</Review>
                    <By>Reviewed by: {item.email}</By>
                  </Box2>
                </Container>
              );
            })
          : ""}
      </div>
    </>
  );
};

export default FriendReview;
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
