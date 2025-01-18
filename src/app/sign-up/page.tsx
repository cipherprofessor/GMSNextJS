"use client"

import React, { useState, useEffect, useRef, Suspense } from "react";
import { SignUp, useUser } from "@clerk/clerk-react";
import Link from "next/link";
import styles from "./SignupPageClerk.module.scss";
// import { authConstants } from "../../../components/MyFigma/LoginSignupFigma/authConstants";
import LoadingSpinner from "@/components/LoadingSpinner";

const SignUpPageClerk: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [isSignUpLoaded, setIsSignUpLoaded] = useState(false);
  const signUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (signUpRef.current) {
      setIsSignUpLoaded(true);
    }
  }, [signUpRef.current]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <Link href="/profile" replace>
        <a></a>
      </Link>
    );
  }

  return (
    <div className={styles.signupmainScreenLogin}>
      <div className={styles.signupleftSide}>
        <div ref={signUpRef}>
          {isSignUpLoaded ? <SignUp /> : <div></div>}
        </div>
      </div>
      <div className={styles.signuprightSide}>
        <div className={styles.signuprightContainer}>
          <div className={styles.signuprightText}>
            <div className={styles.signuptextheading}>
              Welcome To SignUp Page
            </div>
            <div className={styles.signuptextsubheading}>
              <p>Travel with us and explore the world</p>
            </div>
          </div>
          <div className={styles.signupmainImageRight}>
            <img
              src="https://www.endeavourweigh.com/wp-content/uploads/2024/03/Rto1.png"
              alt="MainImage"
              className={styles.signupmainImageRight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUpPageClerkWrapper: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <SignUpPageClerk />
  </Suspense>
);

export default SignUpPageClerkWrapper;