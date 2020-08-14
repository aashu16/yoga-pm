import React from "react";
import styled from "styled-components";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

const AuthenticationWrapper = styled.div`
  padding: 1rem;
  border: 1px solid palegoldenrod;
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  min-width: 325px;
  max-width: 500px;
  margin: 10rem auto;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: palevioletred;
  color: antiquewhite;
  border: none;
  border-radius: 4px;
`;

const SignUp = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    console.log(email, password);
    // Call to /signup

    navigate("/p");
  };

  return (
    <AuthenticationWrapper>
      <label htmlFor="email">Email</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSignup}>Sign up</Button>
      <Link to="/a/i">Existing user? Sign in instead.</Link>
    </AuthenticationWrapper>
  );
};

const SignIn = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSignin = () => {
    // Call to /signin
  };

  return (
    <AuthenticationWrapper>
      <label htmlFor="email">Email</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSignin}>Sign in</Button>
      <Link to="/a/u">New user? Sign up here.</Link>
    </AuthenticationWrapper>
  );
};

const Authentication = () => {
  return (
    <div>
      <Routes>
        <Route path="u" element={<SignUp />} />
        <Route path="i" element={<SignIn />} />
      </Routes>
    </div>
  );
};

export default Authentication;
