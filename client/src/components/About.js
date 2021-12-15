import React from "react";
import styled from "styled-components";

const About = () => {
  return (
    <Wrapper>
      <H2>About</H2>
      <Description>
        Introducing{" "}
        <Span>
          better<strong>Reads.</strong>
        </Span>
      </Description>
      <Div>
        <Description>
          <Span>
            better<strong>Reads</strong>
          </Span>{" "}
          was born out of a desire for a cleaner, more beautiful, social reading
          experience. betterReads is centered around a community of readers who
          wish to catalogue their personal reading habits and stay up to date
          with what their friends are reading. Our founder, Bridget, created our
          website using React, Node.js, MongoDB, styled-components, and Auth0.
          All business inquiries, including inquires on how to hire Bridget,
          should be directed to bridget.walsh@mail.mcgill.ca.
        </Description>
      </Div>
    </Wrapper>
  );
};

export default About;
const Wrapper = styled.div`
  margin-left: 25%;
  margin-top: 3%;
`;
const Description = styled.p`
  margin-top: 10px;
  font-size: 18px;
  line-height: 22px;
`;
const H2 = styled.h2`
  color: #00a676;
  margin-top: 30px;
`;
const Div = styled.div`
  max-width: 500px;
`;

const Span = styled.span`
  color: #00a676;
`;
