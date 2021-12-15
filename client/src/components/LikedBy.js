import React from "react";
import styled from "styled-components";

const LikedBy = (likers) => {
  const weird = likers.likers;
  return (
    <>
      <p>Liked By:</p>
      {weird !== 0 &&
        weird !== null &&
        weird.map((name) => {
          return <p>{name}</p>;
        })}
    </>
  );
};

export default LikedBy;
