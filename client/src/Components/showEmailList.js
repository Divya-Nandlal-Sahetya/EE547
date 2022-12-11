//import { TableCell } from "@material-ui/core";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useState, useEffect } from "react";
import "./showEmailList.css"
import { width } from '@mui/system';
const tokens = require("./tokens")

export function ShowEmailList({isLoggedIn, isGmailEnabled}){

  const [token, setToken] = useState('adfsfasdf')
  const [emails, setEmails] = useState([])

  useEffect(() => {
    if (isLoggedIn) {
        const fetchData = async () => {
            const token = await tokens.getToken(); // get the data from the api
            setToken(token); // set state with the result
        }
        fetchData().catch(console.error)
    }
    }, [isLoggedIn])

  useEffect(() => {

    console.log("gmail effect")
    console.log(isLoggedIn, isGmailEnabled, token)
    if(isLoggedIn === true && isGmailEnabled === true && token !== undefined && token !== ''){

      const time = new Date()
      fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+token
        }
      })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then(data => {
        console.log('list gmail data:', data)
        //var result = []
        for(let i = 0; i < 5; i++){
          let element = data.messages[i]
          fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/" + element.id, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+token
        },
      }).then((res) => {
        console.log(res)
        return res.json()
        }
      ).then((r) => {
        console.log("response.snippet")
        let mailItem = {
          body : r.snippet,
          from : "",
          date : ""
        }
          console.log(mailItem)
          r.payload.headers.forEach(x => {
            if(x.name === "From"){
              mailItem.from = x.value;
            }
            if(x.name === "Date"){
              mailItem.date = x.value;
            }
          })
         
          //result.push(r.snippet)
          setEmails(resultArr => [...resultArr, mailItem])
      })
      //console.log(element)
        }
        // data.messages.forEach(element => {
          
        // });
        
        // console.log("result.length")
      })
    }
  }, [isLoggedIn, isGmailEnabled, token])

  return(
    <div>
      {(isLoggedIn && isGmailEnabled && emails !== undefined && emails !== null) ?
        emails.length === 0 ?
          "No emails to Show"
          : <div>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>From</TableCell>
            <TableCell width= "50%">Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {emails.map((row) => (
            <TableRow
              key={row.date}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell>{row.from}</TableCell>
              <TableCell width= "50%">{row.body}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
        : <></>}
    </div>
  )
}