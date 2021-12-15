import React, { useEffect } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { keyframes } from "styled-components";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router";

const Bookshelves = () => {
  const { user } = useAuth0();
  let navigate = useNavigate();

  //state variables
  const [load, setLoad] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [wait, setWait] = React.useState(false);
  const [hold, setHold] = React.useState(false);

  const [current, setCurrent] = React.useState([]);
  const [fav, setFav] = React.useState([]);
  const [toBeRead, setToBeRead] = React.useState([]);
  const [alreadyRead, setAlreadyRead] = React.useState([]);

  const [numRead, setNumRead] = React.useState(11);
  const [numCurrent, setNumCurrent] = React.useState(11);
  const [numToBeRead, setNumToBeRead] = React.useState(11);
  const [numFav, setNumFav] = React.useState(11);

  //FUNCTIONS
  //for currently reading
  const pushCurrent = (param) => {
    //create empty array
    let CR = [];
    //iterate through param array and push each promise, which is resolved (line 32), to the array
    for (let i = 0; i < param.length; i++) {
      CR.push(
        fetch(
          `https://www.googleapis.com/books/v1/volumes/${param[i]}?key=${process.env.REACT_APP_APIKEY}`
        )
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
      );
    }
    //only AFTER ALL promises are resolved do we reassign to a state variable -- solves weird rendering issues
    Promise.all(CR).then((data) => {
      setCurrent(data);
    });
  };

  //for favs
  const pushFav = (param) => {
    let favs = [];
    for (let i = 0; i < param.length; i++) {
      favs.push(
        fetch(
          `https://www.googleapis.com/books/v1/volumes/${param[i]}?key=${process.env.REACT_APP_APIKEY}`
        )
          .then((res) => res.json())
          .then((info) => {
            return info;
          })
      );
    }
    Promise.all(favs).then((info) => {
      setFav(info);
    });
  };
  //for read
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

  //for tbr
  const pushTBR = (param) => {
    let tbr = [];
    for (let i = 0; i < param.length; i++) {
      tbr.push(
        fetch(
          `https://www.googleapis.com/books/v1/volumes/${param[i]}?key=${process.env.REACT_APP_APIKEY}`
        )
          .then((res) => res.json())
          .then((info) => {
            return info;
          })
      );
    }
    Promise.all(tbr).then((info) => {
      setToBeRead(info);
    });
  };

  //HOOKS
  //get books shelved as "currentlyReading"
  useEffect(() => {
    setLoad(true);
    user &&
      fetch("/api/currentlyreading", {
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
          pushCurrent(info.currentlyReading.currentlyReading);
        })
        .finally(() => {
          setLoad(false);
        });
  }, [user]);

  //get books shelved as TBR
  useEffect(() => {
    setLoader(true);
    user &&
      fetch("/api/tbr", {
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
          pushTBR(info.TBR.TBR);
        })
        .finally(() => {
          setLoader(false);
        });
  }, [user]);

  //get books shelved as Favorites
  useEffect(() => {
    setWait(true);
    user &&
      fetch("/api/favorites", {
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
          pushFav(info.Favorites.Favorites);
        })
        .finally(() => {
          setWait(false);
        });
  }, [user]);

  //for read
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

    if (field === "currentlyReading") {
      let change = current.filter((item) => {
        return item.id !== volumeId;
      });
      setCurrent(change);
      return current;
    } else if (field === "Favorites") {
      let change = fav.filter((item) => {
        return item.id !== volumeId;
      });
      setFav(change);
      return fav;
    } else if (field === "TBR") {
      let change = toBeRead.filter((item) => {
        return item.id !== volumeId;
      });
      setToBeRead(change);
      return;
    } else if (field === "Read") {
      let change = alreadyRead.filter((item) => {
        return item.id !== volumeId;
      });
      setAlreadyRead(change);
      return alreadyRead;
    }
  };
  const handleRead = () => navigate("/read");
  const handleFav = () => navigate("/fav");
  const handleToBeRead = () => navigate("/tbr");

  const handleBookDetails = (e, param) => {
    e.preventDefault();
    navigate(`/book/${param}`);
  };
  return (
    <Wrapper>
      <H2>Bookshelves</H2>
      <Description>
        View and edit your shelves. To review a book, click on your "Read"
        shelf.
      </Description>
      <Container>
        <ShelfRead onClick={handleRead}>Read</ShelfRead>
        {hold ? (
          <Loader></Loader>
        ) : (
          <BooksDiv>
            {alreadyRead.length > 0 &&
              alreadyRead
                .slice(0, numRead ? numRead : alreadyRead.length)
                .map((obj) => {
                  let thumbnail = obj?.volumeInfo?.imageLinks.thumbnail;
                  let volumeId = obj?.id;
                  return (
                    <BookDiv>
                      <BookDetailsButton
                        onClick={(e) => handleBookDetails(e, volumeId)}
                      >
                        <Img src={thumbnail} alt="cover" />
                      </BookDetailsButton>
                      <Remove
                        onClick={(e) => handleDelete(e, volumeId, "Read")}
                      >
                        Remove
                      </Remove>
                    </BookDiv>
                  );
                })}
            {alreadyRead.length ? <More onClick={handleRead}>More +</More> : ""}
          </BooksDiv>
        )}
      </Container>
      <Container>
        <ShelfTitle>Currently Reading</ShelfTitle>
        {load ? (
          <Loader></Loader>
        ) : (
          <BooksDiv>
            {current.length > 0 &&
              current
                .slice(0, numCurrent ? numCurrent : current.length)
                .map((obj) => {
                  let thumbnail = obj?.volumeInfo?.imageLinks.thumbnail;
                  let volumeId = obj?.id;
                  return (
                    <BookDiv>
                      <BookDetailsButton
                        onClick={(e) => handleBookDetails(e, volumeId)}
                      >
                        <Img src={thumbnail} alt="cover" />
                      </BookDetailsButton>
                      <Remove
                        onClick={(e) =>
                          handleDelete(e, volumeId, "currentlyReading")
                        }
                      >
                        Remove
                      </Remove>
                      {current.length === 11 ? (
                        <More onClick={handleRead}>More +</More>
                      ) : (
                        ""
                      )}
                    </BookDiv>
                  );
                })}
          </BooksDiv>
        )}
      </Container>
      <Container>
        <ShelfTitle onClick={handleToBeRead}>To Be Read</ShelfTitle>
        {loader ? (
          <Loader></Loader>
        ) : (
          <BooksDiv>
            {toBeRead.length > 0 &&
              toBeRead
                .slice(0, numToBeRead ? numToBeRead : toBeRead.length)
                .map((obj) => {
                  let thumbnail = obj?.volumeInfo?.imageLinks.thumbnail;
                  let volumeId = obj?.id;
                  return (
                    <BookDiv>
                      <BookDetailsButton
                        onClick={(e) => handleBookDetails(e, volumeId)}
                      >
                        <Img src={thumbnail} alt="cover" />
                      </BookDetailsButton>
                      <Remove onClick={(e) => handleDelete(e, volumeId, "TBR")}>
                        Remove
                      </Remove>
                      {toBeRead.length === 11 ? (
                        <More onClick={handleToBeRead}>More +</More>
                      ) : (
                        ""
                      )}
                    </BookDiv>
                  );
                })}
          </BooksDiv>
        )}
      </Container>
      <Container>
        <ShelfTitle onClick={handleFav}>Favorites</ShelfTitle>
        {wait ? (
          <Loader></Loader>
        ) : (
          <BooksDiv>
            {fav.length > 0 &&
              fav.slice(0, numFav ? numFav : fav.length).map((obj) => {
                let thumbnail = obj?.volumeInfo?.imageLinks.thumbnail;
                let volumeId = obj?.id;
                return (
                  <BookDiv>
                    <BookDetailsButton
                      onClick={(e) => handleBookDetails(e, volumeId)}
                    >
                      <Img src={thumbnail} alt="cover" />
                    </BookDetailsButton>
                    <Remove
                      onClick={(e) => handleDelete(e, volumeId, "Favorites")}
                    >
                      Remove
                    </Remove>
                    {fav.length === 11 ? (
                      <More onClick={handleFav}>More +</More>
                    ) : (
                      ""
                    )}
                  </BookDiv>
                );
              })}
          </BooksDiv>
        )}
      </Container>
    </Wrapper>
  );
};

export default Bookshelves;
const fadeIn = keyframes`
  from {
   opacity: 0
  }
  to {
    opacity: 1;
  }
  `;

const Wrapper = styled.div`
  margin-left: 25%;
  animation: ${fadeIn} 2s;
`;

const More = styled.button`
  height: 150px;
  width: 100px;
  background-color: #00a676;
  border: none;
  margin-top: 11px;
  position: relative;
  right: -16px;
  &:hover {
    cursor: pointer;
  }
`;

const Img = styled.img`
  height: 150px;
  margin-top: 5px;
  margin-right: 5px;
`;
const BookDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 98px;
  margin: 5px;
`;

const BooksDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
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
const Description = styled.p`
  margin-top: 5px;
  margin-bottom: 10px;
`;
const H2 = styled.h2`
  color: #00a676;
  margin-top: 30px;
`;
const ShelfTitle = styled.h4`
  font-family: "Outfit", sans-serif;
  font-weight: bolder;
  text-decoration: underline;
  margin-bottom: 3px;
`;

const ShelfRead = styled.h4`
  font-family: "Outfit", sans-serif;
  font-weight: bolder;
  text-decoration: underline;
  margin-bottom: 3px;
  &:hover {
    cursor: pointer;
  }
`;

const Container = styled.div`
  border: solid;
  padding: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
  width: 750px;
  border-radius: 15px;
  border-width: thin;
  border-color: #00a676;
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
const BookDetailsButton = styled.button`
  border: none;
  background-color: transparent;
  color: black;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
