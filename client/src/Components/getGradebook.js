import React, {useEffect, useState} from "react";
import {useQuery,gql} from '@apollo/client'
import {LOAD_STUDENT, LOAD_STUDENTS} from '../GraphQL/Queries'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from "@mui/material";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error"
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from "@mui/material/Paper";
import Table from '@mui/material/Table';





function GetPersons({emailid}) {



    const {error,loading,data} = useQuery(LOAD_GRADEBOOK,{ variables: { emailid } }); 
    const [records,setRecords] = useState({});


      
    useEffect(() => {
        console.log("getGradebook.js 2 | data", data);
        if (data) {
          console.log("*******************************************",data.student);   
            setRecords(data.student);


        }
        if (error) {
            console.log(error);
        }


    }, [data])



  if (records.length === 0){
    return (
      <div>
        <h3>No records found</h3>
      </div>
    )
  }
  return (
    
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="auto">Name</TableCell>
            <TableCell align="auto">Email</TableCell>
            <TableCell align="auto">GPA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow
              key={records.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}  
            >
              <TableCell align="auto">{records.name}</TableCell>
              <TableCell align="auto">{records.gpa}</TableCell>
            </TableRow>


        </TableBody>
      </Table>
      )
    }


export default GetPersons;