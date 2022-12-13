import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import ExpandCard from './CollapseCard';
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
                body : r.snippet,
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
              console.log(e)
              return (
                <>
                  <ExpandCard from={e.from} date={e.date} message={e.message} />
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