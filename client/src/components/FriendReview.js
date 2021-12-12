import React from "react";
import { useEffect } from "react";
import SingleReview from "./SingleReview";

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
              return <SingleReview review={item} />;
            })
          : ""}
      </div>
    </>
  );
};

export default FriendReview;
