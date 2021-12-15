import React, { useEffect } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { BiSearchAlt2 } from "react-icons/bi";
import FriendReview from "./FriendReview";
import { keyframes } from "styled-components";
import { FiLoader } from "react-icons/fi";

const Social = () => {
  const { user } = useAuth0();
  //state variables
  const [search, setSearch] = React.useState(null);
  const [friend, setFriend] = React.useState(null);
  const [profile, setProfile] = React.useState(null);

  //functions
  const handleFriendSearch = (e) => {
    e.preventDefault();
    fetch(`/api/friend/${search}`)
      .then((res) => res.json())
      .then((data) => {
        setFriend(data);
      });
  };

  const handleFriendRequest = (e) => {
    e.preventDefault();
    fetch("/api/addfriend", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: user.email,
        email: friend.data.email,
      }),
    }).then((res) => res.json());
  };

  useEffect(() => {
    user &&
      fetch(`/api/friend/${user?.email}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
        });
  }, [user]);

  return (
    <Wrapper>
      <H2>Social</H2>
      <Description>
        Search for friends to see what they're reading and what they think about
        it.
      </Description>
      <Div>
        <form onSubmit={handleFriendSearch}>
          <Input
            type="text"
            placeholder="search for friends by email"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          ></Input>
          <Button type="submit">
            <Search />
          </Button>
        </form>
        {friend?.data && (
          <Container>
            <p>{friend?.data.email}</p>
            <Add onClick={handleFriendRequest}>ADD</Add>
          </Container>
        )}
      </Div>
      <FriendArray>
        {profile?.data ? (
          profile.data.friends.map((friend, index) => {
            return <FriendReview idOfFriend={friend} />;
          })
        ) : (
          <Loader></Loader>
        )}
      </FriendArray>
    </Wrapper>
  );
};

export default Social;

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
const FriendArray = styled.div`
  margin-top: 50px;
`;
const Description = styled.p`
  margin-top: 5px;
  margin-bottom: 10px;
`;
const H2 = styled.h2`
  color: #00a676;
  margin-top: 30px;
`;
const Div = styled.div`
  margin: 0 auto;
`;

const Input = styled.input`
  border: none;
  border-radius: 20px;
  width: 320px;
  margin-top: 30px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin-top: 10px;
  margin-left: 10px;
  align-items: center;
  &:hover {
    background-color: #c7e1d9;
    padding: 5px;
    border-radius: 15px;
  }
`;
const Add = styled.button`
  border: none;
  background-color: #00a676;
  border-radius: 15px;
  color: #f7f9f9;
  font-size: 15px;
  margin-top: 4px;
  &:hover {
    cursor: pointer;
  }
`;
const Search = styled(BiSearchAlt2)`
  color: #00a676;
  position: relative;
  right: 40px;
  top: 6px;
`;
const Button = styled.button`
  border: none;
  background-color: transparent;
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
  margin-left: 35%;
  margin-top: 30px;
  margin-bottom: 30px;
  color: #00a676;
`;
