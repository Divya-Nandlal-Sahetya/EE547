import React from "react";
import { Link } from "react-router-dom";
import {ApolloClient,InMemoryCache,ApolloProvider,HttpLink,from} from '@apollo/client';
import {onError} from "@apollo/client/link/error"
import Form from "./Form.js";
import GetStudents from "./GetStudents.js";


const errorLink = onError(({graphqlErrors, networkError}) => {
    if (graphqlErrors) {
      graphqlErrors.map(({message, location, path}) => {
        alert(`Graphql error ${message}`)
      });
    }
  });

const link = from([
    errorLink,
    new HttpLink({uri: "/graphql/"})
  ])


const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });

export default function Dashboard() {
    return (
        <div className= 'body'>
        <ApolloProvider client={client}>
        <h1>Student Management System</h1>
        <GetStudents/>
        </ApolloProvider>
        <h1 className="main-title home-page-title">Welcome!</h1>
            
            
            
            <Link to="/">
                <button className="primary-button">Log out</button>
            </Link>
        </div>
    )
}