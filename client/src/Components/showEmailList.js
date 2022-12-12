//import { TableCell } from "@material-ui/core";
//import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { AutoSizer, Column, Table } from 'react-virtualized';
import React, { useState, useEffect } from "react";
const tokens = require("./tokens")


export function ShowEmailList({isLoggedIn, isGmailEnabled}){

  const [token, setToken] = useState('adfsfasdf')
  const [emails, setEmails] = useState([])
  const [emaillen, setlength] = useState(0)
  

  function createData(id, from, date, message) {
    return { id, from, date, message};
  }


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
        },
        labelIds: ["INBOX"],
      })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then(data => {
        console.log('list gmail data:', data)
        //var result = []
        //let index = 0;
        data.messages.forEach(element => {
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
              console.log(r.snippet)
              setlength(result => (result+1))
              let mailItem = {
                body : (r.snippet.length > 75) ? r.snippet.substring(0, 75) + '...' : r.snippet,
                from : "",
                date : ""
              }
              console.log("mailItem");
              console.log(mailItem);
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
                setEmails(resultArr => [...resultArr, createData(emaillen, mailItem.from, mailItem.date, mailItem.body)])
          })
          //console.log(element)
        });
        
        console.log("result.length")
      })
    }
  }, [isLoggedIn, isGmailEnabled, token])

  return(
<List sx={{ width: '100%', maxWidth: "auto", bgcolor: 'background.paper' }}>
      {
        isLoggedIn && isGmailEnabled !== undefined && emails !== null ?
          (emails.length === 0 ?
            `No emails`
            :

            emails.map(e => {
              return (
                <>
                  <Card style={{ marginBottom: '5px', marginTop: '5px'}}>
                    <CardContent style={{ padding: 'unset'}}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={e.from}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="h1"
                                variant="caption"
                                color="text.primary"
                              >
                                {e.date}
                              </Typography>
                              {` — ${e.message}`}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      
                    </CardContent>
                  </Card>
                  <Divider variant="inset" component="li" style={{ margin: 'unset' }} />
                </>
              )
            })


          )
          :
          "NOT LOGGED IN"
      }

    </List>
  )
}



  //   <div>
  //     {(isLoggedIn && isGmailEnabled && emails !== undefined && emails !== null) ?
  //       emails.length === 0 ?
  //         "No emails to Show"
  //         : <Paper style={{ height: 350, width: '100%' }}>
  //         <VirtualizedTable
  //           rowCount={emails.length}
  //           rowGetter={({ index }) => emails[index]}
  //           columns={[
  //             {
  //               width: 150,
  //               label: 'Date',
  //               dataKey: 'date',
  //             },
  //             {
  //               width: 200,
  //               label: 'From',
  //               dataKey: 'from',
  //             },
  //             {
  //               width: 600,
  //               height: 100,
  //               label: 'Message',
  //               dataKey: 'message'
  //             },
  //           ]}
  //         />
  //       </Paper>
  //       : <></>}
  //   </div>
  // )
// }
