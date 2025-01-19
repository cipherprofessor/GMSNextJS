"use client"
import React, { useState, useEffect, useRef, Suspense } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import Link from "next/link";
import styles from "./SignInPageClerk.module.scss";
// import { authConstants } from "../../../components/MyFigma/LoginSignupFigma/authConstants";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import GatePassImage from "../../../public/GPMSLanding.png";

const SignInPageClerk: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [isSignInLoaded, setIsSignInLoaded] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (signInRef.current) {
      setIsSignInLoaded(true);
    }
  }, [signInRef.current]);

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
    <div className={styles.loginmainScreenLogin}>
      <div className={styles.loginleftSide}>
        <div ref={signInRef}>
          {isSignInLoaded ? <SignIn /> : <div></div>}
        </div>
      </div>
      <div className={styles.loginrightSide}>
        <div className={styles.loginrightContainer}>
          <div className={styles.loginrightText}>
            <div className={styles.logintextheading}>
              Welcome to Gate Management System
            </div>
            <div className={styles.logintextsubheading}>
              <p>Please Login To Use The Portal</p>
            </div>
          </div>
            <Image
              src={GatePassImage}
              alt="Gate Pass Management System"
              className={styles.loginmainImageRight}
            />
          </div>
        </div>
      </div>
  );
};

const SignInPageClerkWrapper: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <SignInPageClerk />
  </Suspense>
);

export default SignInPageClerkWrapper;