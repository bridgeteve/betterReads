import React, { useEffect } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import { keyframes } from "styled-components";
import { FiLoader } from "react-icons/fi";
import { BsPencil } from "react-icons/bs";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const Reviews = () => {
  let navigate = useNavigate();
  const { user } = useAuth0();
  const [reviews, setReviews] = React.useState(null);
  const [numReviews, setNumReviews] = React.useState(4);

  //state variable used as a flag for modal
  const [open, setOpen] = React.useState(false);

  //state variables hold information from my map, which is scoped otherwise
  const [modalContent, setModalContent] = React.useState(null);
  const [volumeId, setVolumeId] = React.useState(null);
  const [review, setReview] = React.useState(null);
  const [rating, setRating] = React.useState(null);

  //hook to get reviews authored by the currently signed in user
  useEffect(() => {
    user &&
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
  }, [user]);

  const handleRedirect = (e, param) => {
    e.preventDefault();
    navigate(`/book/${param}`);
  };

  //open modal and reassign information from the map to state variables
  const handleOpen = (thumbnail, volumeId, editMe) => {
    setOpen(true);
    setModalContent(thumbnail);
    setVolumeId(volumeId);
    setReview(editMe);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = () => {
    setNumReviews(numReviews + 4);
  };
  //update the review in "reviews" collection in mongoDB
  const handleEdit = (param) => {
    fetch("/api/updateReview", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review: review,
        rating: rating,
        id: param,
      }),
    });
    handleClose();
  };

  return (
    <Wrapper>
      <H2>Reviews</H2>
      <Description>
        View your reviews, collated here, for your convenience. Changed your
        mind about a book? Click the pencil icon to edit your review.
      </Description>
      {reviews ? (
        <div>
          {reviews
            .slice(0, numReviews ? numReviews : reviews.length)
            .map((item) => {
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
                  <div>
                    <EditButton
                      type="button"
                      onClick={() =>
                        handleOpen(item.thumbnail, item.id, item.review)
                      }
                    >
                      <Pencil />
                    </EditButton>
                  </div>
                </Container>
              );
            })}

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-review"
          >
            <DialogContent>
              <Organize>
                <div>
                  <Img src={modalContent} alt="cover" />
                </div>
                <ModalLayout>
                  <Textarea
                    onChange={(e) => {
                      setReview(e.target.value);
                    }}
                  >
                    {review}
                  </Textarea>
                  <Span>
                    {" "}
                    Overall Rating:
                    <Input
                      type="text"
                      onChange={(e) => {
                        setRating(e.target.value);
                      }}
                    ></Input>{" "}
                    /10
                  </Span>
                </ModalLayout>
              </Organize>
              <DialogActions>
                <SubmitButton onClick={() => handleEdit(volumeId)}>
                  SAVE CHANGES
                </SubmitButton>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Loader></Loader>
      )}
      {reviews?.length > 4 ? (
        <MoreButton onClick={handleClick}>View More</MoreButton>
      ) : (
        ""
      )}
    </Wrapper>
  );
};

export default Reviews;

const fadeIn = keyframes`
  from {
   opacity: 0
  }
  to {
    opacity: 1;
  }
  `;
const MoreButton = styled.button`
  border: none;
  color: #f7f9f9;
  margin: 0 auto;
  margin-bottom: 30px;
  margin-top: 30px;
  background-color: #00a676;
  border-radius: 15px;
  margin-left: 25%;
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
const EditButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 10px;
  &:hover {
    cursor: pointer;
    background-color: #c7e1d9;
    border-radius: 50%;
    padding: 10px;
  }
`;
const Wrapper = styled.div`
  margin-left: 25%;
  animation: ${fadeIn} 2s;
`;
const Description = styled.p`
  margin-top: 5px;
  margin-bottom: 25px;
  max-width: 700px;
  line-height: 1.3;
`;
const Pencil = styled(BsPencil)`
  color: #00a676;
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
    text-decoration: underline;
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
const Organize = styled.div`
  display: flex;
`;

const Textarea = styled.textarea`
  resize: none;
  height: 150px;
  width: 350px;
`;
const ModalLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-left: 15px;
`;

const Span = styled.span`
  font-family: "Outfit", sans-serif;
  margin-top: 15px;
`;

const SubmitButton = styled.button`
  border: none;
  background-color: #00a676;
  padding: 10px;
  border-radius: 15px;
  font-size: 18px;
`;
const Input = styled.input`
  width: 10px;
  height: 15px;
  margin-left: 5px;
  margin-top: 2px;
  font-size: 13px;
`;
