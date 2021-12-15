import React, { useEffect } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { keyframes } from "styled-components";
import { FiLoader } from "react-icons/fi";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const Read = () => {
  const { user } = useAuth0();
  //state variable necessary to render the shelf
  const [alreadyRead, setAlreadyRead] = React.useState([]);
  //state variable used as a flag for modal
  const [open, setOpen] = React.useState(false);
  //state variable for loading state
  const [hold, setHold] = React.useState(false);

  //state variables hold information from my map, which is scoped otherwise
  const [modalContent, setModalContent] = React.useState(null);
  const [volumeId, setVolumeId] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  //state variables to hold review and rating information
  const [review, setReview] = React.useState(null);
  const [rating, setRating] = React.useState(null);
  //following two functions are the same as in "bookshelves"
  const pushRead = (param) => {
    let read = [];
    for (let i = 0; i < param.length; i++) {
      read.push(
        fetch(
          `https://www.googleapis.com/books/v1/volumes/${param[i]}?key=${process.env.REACT_APP_APIKEY}`
        )
          .then((res) => res.json())
          .then((info) => {
            return info;
          })
      );
    }
    Promise.all(read).then((info) => {
      setAlreadyRead(info);
    });
  };

  useEffect(() => {
    setHold(true);
    user &&
      fetch("/api/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      })
        .then((res) => res.json())
        .then((info) => {
          pushRead(info.Read.Read);
        })
        .finally(() => {
          setHold(false);
        });
  }, [user]);

  //open modal and reassign information from the map to state variables
  const handleOpen = (thumbnail, volumeId, title) => {
    setOpen(true);
    setModalContent(thumbnail);
    setVolumeId(volumeId);
    setTitle(title);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //submit the review as a new object in "reviews" collection in mongoDB
  const handleSubmit = (volumeId, modalContent, title) => {
    fetch("/api/addReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        review: review,
        rating: rating,
        id: volumeId,
        thumbnail: modalContent,
        title: title,
      }),
    });
    handleClose();
  };

  const handleDelete = (e, volumeId, field) => {
    e.preventDefault();
    fetch("/api/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        shelf: field,
        volumeId: volumeId,
      }),
    });

    if (field === "Read") {
      let change = alreadyRead.filter((item) => {
        return item.id !== volumeId;
      });
      setAlreadyRead(change);
      return alreadyRead;
    }
  };

  return (
    <Wrapper>
      <H2>Read</H2>
      <Description>Click on a book you've read to review it.</Description>
      {hold ? (
        <Loader></Loader>
      ) : (
        <div>
          <BooksDiv>
            {alreadyRead.length > 0 &&
              alreadyRead.map((obj) => {
                let thumbnail = obj?.volumeInfo?.imageLinks.thumbnail;
                let volumeId = obj?.id;
                let title = obj?.volumeInfo.title;
                return (
                  <Div>
                    <Button
                      type="button"
                      onClick={() => handleOpen(thumbnail, volumeId, title)}
                    >
                      <Img src={thumbnail} alt="cover" />
                    </Button>
                    <Remove onClick={(e) => handleDelete(e, volumeId, "Read")}>
                      Remove
                    </Remove>
                  </Div>
                );
              })}
          </BooksDiv>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="submit-review"
          >
            <DialogContent>
              <Organize>
                <div>
                  <Img src={modalContent} alt="cover" />
                </div>
                <ModalLayout>
                  <Textarea
                    placeholder="How was the book?"
                    onChange={(e) => {
                      setReview(e.target.value);
                    }}
                  ></Textarea>
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
                <SubmitButton
                  onClick={() => handleSubmit(volumeId, modalContent, title)}
                >
                  SUBMIT
                </SubmitButton>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Wrapper>
  );
};

export default Read;
const Wrapper = styled.div`
  margin-left: 25%;
  margin-top: 3%;
`;
const Description = styled.p`
  margin-top: 5px;
`;
const H2 = styled.h2`
  color: #00a676;
  margin-top: 30px;
`;
const Input = styled.input`
  width: 10px;
  height: 15px;
  margin-left: 5px;
  margin-top: 2px;
  font-size: 13px;
`;
const Organize = styled.div`
  display: flex;
`;
const BooksDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;
  width: 98px;
  margin: 5px;
`;
const SubmitButton = styled.button`
  border: none;
  background-color: #00a676;
  padding: 10px;
  border-radius: 15px;
  font-size: 18px;
`;
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
  margin-left: 300px;
  margin-top: 40px;
  color: #00a676;
`;
const Img = styled.img`
  height: 150px;
  margin-top: 5px;
  margin-right: 5px;
  &:hover {
    filter: grayscale(100%);
  }
`;
const Button = styled.button`
  border: none;
  background-color: transparent;
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
const Remove = styled.button`
  border: none;
  background-color: #00a676;
  border-radius: 15px;
  color: #f7f9f9;
  font-size: 15px;
  margin-top: 4px;
  margin-left: 4px;
  &:hover {
    cursor: pointer;
  }
`;
