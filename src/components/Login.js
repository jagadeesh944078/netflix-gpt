import React, { useRef, useState } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [isSignInForm, setIsSignedForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const toggleSignInForm = () => {
    setIsSignedForm(!isSignInForm);
  };

  const handleButtonClick = () => {
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);

    if (message) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: "https://avatars.githubusercontent.com/u/46147427?v=4",
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(addUser({ uid, email, displayName, photoURL }));
            })
            .catch((error) => {
              console.log(error.message);
            });
          navigate("/browse");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
          // ..
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          navigate("/browse");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  return (
    <div>
      <Header />
      <div className="absolute">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/42df4e1f-bef6-499e-87ff-c990584de314/5e7c383c-1f88-4983-b4da-06e14c0984ba/IN-en-20230904-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt="backgroundImage"
        />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-1/3 bg-black absolute p-12 my-32 mx-auto left-0 right-0 text-white rounded-lg opacity-80"
      >
        <h1 className="font-bold text-3xl">Sign In</h1>
        {!isSignInForm && (
          <input
            type="text"
            ref={name}
            placeholder="Full Name"
            className="p-3 my-4 w-full bg-gray-700"
          />
        )}

        <input
          type="text"
          ref={email}
          placeholder="Email Address"
          className="p-3 my-4 w-full bg-gray-700"
        />
        <input
          type="password"
          ref={password}
          placeholder="Enter Password"
          className="p-3 my-4 w-full bg-gray-700"
        />
        <p className="font-bold text-red-600">{errorMessage}</p>
        <button
          className="p-4 my-8 bg-red-800 w-full rounded-lg"
          onClick={handleButtonClick}
        >
          {!isSignInForm ? "Sign Up" : "Sign In"}
        </button>
        <p className="font-bold cursor-pointer" onClick={toggleSignInForm}>
          {!isSignInForm
            ? "Already Registred? Sign In"
            : "New to Netflx? Sign up now."}
        </p>
      </form>
    </div>
  );
};

export default Login;
