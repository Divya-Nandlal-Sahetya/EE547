import React from "react";
import { request, gql } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = "https://192.168.1.81:3000/graphql";
const STUDENTS_QUERY = gql`
query  students{
    fname
    }
`;


export default function App() {
    let data= null
    const students = request(endpoint,
    STUDENTS_QUERY
).then(data => console.log(data));
//     const { data, isLoading, error } = useQuery("launches", () => {
//     return request(endpoint, STUDENTS_QUERY);
//   });
//   if (isLoading) return "Loading...";
//   if (error) return <pre>{error.message}</pre>;
  return (
    <div>
      <h1>data</h1>
    </div>
  );
}