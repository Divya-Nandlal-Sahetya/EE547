import React, { useState, useEffect } from "react";
import {ListBoxComponent, CheckBoxSelection, Inject} from '@syncfusion/ej2-react-dropdowns';
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
        },
      })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then(data => {
        console.log('list gmail data:', data)
        //var result = []
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
              //result.push(r.snippet)
              setEmails(resultArr => [...resultArr, r.snippet])
          })
          //console.log(element)
        });
        
        console.log("result.length")
      })
    }
  }, [isLoggedIn, isGmailEnabled, token])

  return(
    <div>
      {(isLoggedIn && isGmailEnabled && emails !== undefined && emails !== null) ?
        emails.length === 0 ?
          "No emails to Show"
          : <ListBoxComponent dataSource={emails}
          fields={{
            value:"EmployeeID",
            text: "Name"
          }}>
          </ListBoxComponent>
        : <></>}
    </div>
  )
}
