import React, { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from "@mui/material";
const tokens = require("./tokens")

// import closeIcon from './src/public/icons8-remove-24.png'

export function GetEvents({ isLoggedIn, selectedDate, eventChanged, setEventChanged }) {

  const [token, setToken] = useState("")
  const [events, setEvents] = useState([])


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

    console.log("Get Top 10 calendar events of today : ", isLoggedIn, token)
    if (isLoggedIn === true && token !== undefined && token !== '') {

      const time = new Date(selectedDate)
      fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&maxResults=10&timeMin=" + time.toISOString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
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
  }, [isLoggedIn, token, eventChanged, selectedDate])

  function deleteEvent(event) {
    console.log(event)
    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events/" + event.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    })
      .then((response) => {
        console.log(response)

      }).then(() => setEventChanged(prev => !prev))
  }
  return (
    // <div>
    //   {
    //     isLoggedIn && events !== undefined && events !== null ?
    //       events.length === 0 ?
    //         `No events on ${selectedDate}`
    //         :
    //         <>
    //           <div>Events on {new Date(selectedDate).toDateString()}</div>
    //           {
    //             events.map(e => {
    //               return (
    //                 <div style={{ display: 'flex' }}>

    //                   <div style={{ marginRight: '10px' }}>
    //                     {new Date(e.start.dateTime).toDateString() + ' ' + new Date(e.start.dateTime).toLocaleTimeString()}
    //                   </div>
    //                   <div>
    //                     {e.summary}
    //                   </div>
    //                   <div>
    //                     <button onClick={() => deleteEvent(e)} > delete </button>
    //                   </div>

    //                 </div>
    //               )
    //             })}</>
    //       :
    //       <></>
    //   }
    // </div>

    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {
        isLoggedIn && events !== undefined && events !== null ?
          (events.length === 0 ?
            `No events on ${selectedDate}`
            :

            events.map(e => {
              const dt = new Date(e.start.dateTime).toDateString() + ' ' + new Date(e.start.dateTime).toLocaleTimeString();
              return (
                <>
                  <Card style={{ marginBottom: '5px', marginTop: '5px'}}>
                    <CardContent style={{ padding: 'unset'}}>
                      <ListItem alignItems="flex-start">
                        {/* <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                      </ListItemAvatar> */}
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
                              {/* {` — ${e.summary}`} */}
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

