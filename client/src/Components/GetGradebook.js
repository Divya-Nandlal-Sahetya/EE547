import React, {useEffect, useState} from "react";
import {useQuery,gql} from '@apollo/client'
import {LOAD_GRADEBOOK} from '../GraphQL/Queries'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';

function GetGradebook({emailid}) {

    const {error,loading,data} = useQuery(LOAD_GRADEBOOK,{ variables: { emailid } }); 
    const [records,setRecords] = useState([]);

    useEffect(() => {
        console.log("getGradebook.js 2 | data", data);
        if (data) {
          console.log("***********************************",data);   
            setRecords(data.gradebooks);


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
    <TableContainer
  sx={{
    height: 200    
  }}
>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="auto">Subject</TableCell>
            <TableCell align="auto">GPA</TableCell>
            <TableCell align="auto">Grade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          { records.map( record => {
            return (
              <TableRow
              key={record.subject}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}  
            >
              <TableCell align="auto">{record.subject}</TableCell>
              <TableCell align="auto">{record.gpa}</TableCell>
              <TableCell align="auto">{record.grade}</TableCell>
            </TableRow>

            )
          })}
        </TableBody>
      </Table>
      </TableContainer>
      )
    }


export default GetGradebook;