import React, {useEffect, useState} from "react";
import {useQuery,gql} from '@apollo/client'
import {LOAD_STUDENT} from '../GraphQL/Queries'
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


    const {error,loading,data} = useQuery(LOAD_STUDENT,{ variables: { emailid } }); 
    const [records,setRecords] = useState([]);

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
    
    
    useEffect(() => {
        console.log("GetPersons.js 2 | data", data);
        if (data) {
          console.log("********************************************",data.student);      
            setRecords(records,data.student);
            //Add role here and make view changeable

        }
        if (error) {
            console.log(error);
        }

    }, [data])

  return (
    // records.map(e => {
    //   const dt = new Date(e.start.dateTime).toDateString() + ' ' + new Date(e.start.dateTime).toLocaleTimeString();
    //   return (
    //     <>
          {/* <Card style={{ marginBottom: '5px', marginTop: '5px'}}>
            <CardContent style={{ padding: 'unset'}}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={e.summary}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="h1"
                        variant="caption"
                        color="text.primary"
                      >
                        {dt}
                      </Typography>
                      {` — ${e.summary}`}
                    </React.Fragment>
                  }
                />

              </ListItem>
            </CardContent>
          </Card>
          <Divider variant="inset" component="li" style={{ margin: 'unset' }} /> */}
        // </>
      )
    }

export default GetPersons;