import React, { useState, useEffect } from "react";
import {ListBoxComponent, CheckBoxSelection, Inject} from '@syncfusion/ej2-react-dropdowns';

// import Calendar from "@ericz1803/react-google-calendar";

// const API_KEY = "119721530498-pjoji587bnnc2lsn6ehoocdi87512kko.apps.googleusercontent.com";
// let calendars = [
//   {
//     calendarId: "sameerkhanmd112@gmail.com",
//     color: "#B241D1", //optional, specify color of calendar 2 events
//   },
// ];

// class Example extends React.Component {
//   render() {
//     return (
//       <div>
//         <Calendar apiKey={API_KEY} calendars={["primary"]} />
//       </div>
//     );
//   }
// }


export function Event({isLoggedIn, isGmailEnabled}){

  const [token, setToken] = useState('adfsfasdf')
  const [events, setEvents] = useState([])
  const [emails, setEmails] = useState([])

  useEffect(() => {
      if(isLoggedIn){
      const refreshToken = sessionStorage.getItem("refreshToken");
      fetch("/getValidToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: refreshToken,
          }),
        })
        .then((response) => {
          console.log(response)
          return response.json()
        })
        .then(data => {
          setToken(data.accessToken)
        })
      //   const token = await request.json();
      //   return token;
      }
  }, [isLoggedIn])  


  useEffect(() => {

    console.log("calendar effect")
    console.log(isLoggedIn, token)
    if(isLoggedIn === true && token !== undefined && token !== ''){

      const time = new Date()
      fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&maxResults=10&timeMin="+time.toISOString(), {
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
        console.log('list data:', data)
        setEvents(data.items)
      })
    }
  }, [isLoggedIn, token])

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
    <><div>
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
    </div><div>
        {isLoggedIn && events !== undefined && events !== null ?
          events.length === 0 ?
            "No events Today"
            : events.map(e => {
              return (
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: '10px' }}>
                    time:{e.start.dateTime}
                  </div>
                  <div>
                    {e.summary}
                  </div>
                </div>
              );
            }) :
          <></>}
      </div></>
  )
}
