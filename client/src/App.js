// import React feature here
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

//import our components here
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Bookshelves from "./components/Bookshelves";
import Social from "./components/Social";
import Sidebar from "./components/Sidebar";
import BookDetails from "./components/BookDetails";
import About from "./components/About";
import GlobalStyles from "./components/GlobalStyles";
import Reviews from "./components/Reviews";
import Read from "./components/Read";
import Favorites from "./components/Favorites";
import ToBeRead from "./components/ToBeRead";

const App = () => {
  const [getBooks, setGetBooks] = React.useState(null);
  const { loginWithPopup, logout, user, isAuthenticated } = useAuth0();

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header
        getBooks={getBooks}
        setGetBooks={setGetBooks}
        loginWithPopup={loginWithPopup}
        logout={logout}
        isAuthenticated={isAuthenticated}
        user={user}
      />
      <Sidebar />
      <Main>
        <Routes>
          <Route
            path="/"
            element={<HomePage getBooks={getBooks} setGetBooks={setGetBooks} />}
          />
          <Route path="/shelves" element={<Bookshelves />} />
          <Route path="/social" element={<Social />} />
          <Route path="/book/:volumeId" element={<BookDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/read" element={<Read />} />
          <Route path="/fav" element={<Favorites />} />
          <Route path="/tbr" element={<ToBeRead />} />
        </Routes>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: #f7f9f9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

export default App;
