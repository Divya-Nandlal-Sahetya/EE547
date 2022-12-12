import React, { useState, useEffect } from "react";
import { ShowEmailList } from "./showEmailList";
import { GetEvents } from './listeventApi';
import { CreateEvent } from "./createeventApi";
import { setTokens } from "./tokens";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { Link } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error"
import GetPersons from "./GetPersons.js";

import SendMail from "./sendMail";

import DashboardContent from './d';


function GoogleAPI() {

  const errorLink = onError(({ graphqlErrors, networkError }) => {
    if (graphqlErrors) {
      graphqlErrors.map(({ message, location, path }) => {
        alert(`Graphql error ${message}`)
      });
    }
  });

  const link = from([
    errorLink,
    new HttpLink({ uri: "http://localhost:8080/graphql" })
  ])


  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventChanged, setEventChanged] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isGmailEnabled, setIsGmailEnabled] = useState(true);
  const [emailid, setEmailid] = useState("");


  useEffect(() => {
    handleTokenFromQueryParams();
  }, []);

  const [mails, setMails] = useState([]);

  const createGoogleAuthLink = async () => {
    try {
      const request = await fetch("http://localhost:8080/createAuthLink", {
        method: "POST",
      });
      const response = await request.json();
      window.location.href = response.url;
    } catch (error) {
      console.log("App.js 12 | error", error);
      throw new Error("Issue with Login", error.message);
    }
  };

  const enableGmail = async () => {
    setIsGmailEnabled(true);
    // setMails(getMyGmailList());
  };

  const handleTokenFromQueryParams = () => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("accessToken");
    //Fetch the email using the access token
    const request = fetch("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken, {
      method: "GET",
    });
    request.then((response) => {
      response.json().then((data) => {
        console.log("DATA FROM GET QUERY", data);
        setEmailid(data.email);
        console.log("THE EMAIL ID FETCHED ISSSSSSSSSSSSSSSSSSSSS", data.email);
      });
    });
    const refreshToken = query.get("refreshToken");
    const expirationDate = newExpirationDate();
    console.log("App.js 30 | expiration Date", expirationDate);
    if (accessToken && refreshToken) {
      storeTokenData(accessToken, refreshToken, expirationDate);
      setIsLoggedIn(true);
    }
  };

  const newExpirationDate = () => {
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return expiration;
  };

  const storeTokenData = async (token, refreshToken, expirationDate) => {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("expirationDate", expirationDate);
  };

  const signOut = () => {
    setIsLoggedIn(false);
    sessionStorage.clear();
  };

  return (


    <div >

      <DashboardContent
        signOut={signOut}
        createGoogleAuthLink={createGoogleAuthLink}
        isLoggedIn={isLoggedIn}
        isGmailEnabled={isGmailEnabled}
        setEventChanged={setEventChanged}
        selectedDate={selectedDate}
        eventChanged={eventChanged}
        setSelectedDate={setSelectedDate}
      />

      <br />
      {/* <h1>Google</h1>
        {!isLoggedIn ? (
          <button onClick={createGoogleAuthLink}>Login</button>
        ) : (
          <div>
            <h2>Logged In</h2>
            <button onClick={enableGmail}>gmail list
            </button>
            <div>
      </div>,
            <button onClick={signOut}>Sign Out</button>
          </div>
        )}
        <div>
          <ShowEmailList isLoggedIn={isLoggedIn} isGmailEnabled={isGmailEnabled}/>
        </div>
        <div> 
        <SendMail isLoggedIn={isLoggedIn}/>
        </div>
        
      

          <div>
          <ApolloProvider client={client}>
        <GetStudents/>
        </ApolloProvider>
        </div>
        <div>
          
        <CreateEvent isLoggedIn={isLoggedIn} setEventChanged={setEventChanged} />
        </div>
          
        <Calendar onChange={(prev) => setSelectedDate(prev)} />
      
        <div>
          <GetEvents isLoggedIn={isLoggedIn} selectedDate={selectedDate} eventChanged={eventChanged} setEventChanged={setEventChanged}/>
        </div> */}

    </div>
  );
}

export default GoogleAPI;
