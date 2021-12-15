import React, { useEffect } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { keyframes } from "styled-components";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router";

const Favorites = () => {
  const { user } = useAuth0();
  const [fav, setFav] = React.useState([]);
  const [wait, setWait] = React.useState(false);
  const [numFav, setNumFav] = React.useState(11);
  let navigate = useNavigate();

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

    if (field === "Favorites") {
      let change = fav.filter((item) => {
        return item.id !== volumeId;
      });
      setFav(change);
      return fav;
    }
  };

  const handleBookDetails = (e, param) => {
    e.preventDefault();
    navigate(`/book/${param}`);
  };
  const handleFav = () => navigate("/fav");
  return (
    <Wrapper>
      <H2>Favorites</H2>
      <Container>
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

export default Favorites;

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

const Container = styled.div`
  padding: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
  width: 750px;
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

const H2 = styled.h2`
  color: #00a676;
  margin-top: 30px;
  margin-bottom: 30px;
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
