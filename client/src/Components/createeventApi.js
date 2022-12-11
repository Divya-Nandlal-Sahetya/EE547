
import React, { useState, useEffect } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const tokens = require("./tokens")


export function CreateEvent({isLoggedIn, setEventChanged}) {

    const [token, setToken] = useState("")
    const [events, setEvents] = useState([])

    // Popup state vars
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    useEffect(() => {
        if (isLoggedIn) {
            const fetchData = async () => {
                const token = await tokens.getToken(); // get the data from the api
                setToken(token); // set state with the result
            }
            fetchData().catch(console.error)
        }
    }, [isLoggedIn])

    const [summary, setSummary] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [startDateTime, setStartDateTime] = useState('')
    const [endDateTime, setEndDateTime] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("########################Create event: ", summary)
        //   this.CreateEvent(isLoggedIn,summary,description,location,startDateTime,endDateTime)
        console.log("create event: ", isLoggedIn, token)
        if (token !== undefined && token !== '') {

            let todo = {
                "summary": summary,
                "location": location,
                "description": description,
                "start": {
                  "dateTime": startDateTime + ":00-07:00",
                  "timeZone": "America/Los_Angeles",
                },
                "end": {
                  "dateTime": endDateTime + ":00-07:00",
                  "timeZone": "America/Los_Angeles",
                }
              };

            console.log(todo)
            fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(todo),
            })
            .then((response) => {
                console.log(response)
                return response.json()
            })
            .then(data => {
                console.log('create data:', data)
                setEvents(data.items)
                setEventChanged(prev => !prev)
                closeModal()
            })
        }
    }

    return (
        <>
            <button type="button" className="button" onClick={() => setOpen(o => !o)}>
                Create Event
            </button>
            
            <Popup open={open} closeOnDocumentClick onClose={closeModal} position="bottom left">
                <a className="close" onClick={closeModal}>
                    &times;
                </a>
                <div>
                    <label htmlFor="summary">summary</label>
                    <br />
                    <input type="text" id="summary" value={summary} onChange={e => setSummary(e.target.value)} required/>
                    <br />

                    <label htmlFor="description">Description</label>
                    <br />
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required/>
                    <br />

                    <label htmlFor="location">location</label>
                    <br />
                    <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} />
                    <br />

                    <label htmlFor="startDateTime">Start Date time</label>
                    <br />
                    <input type="datetime-local" id="startDateTime" value={startDateTime} onChange={e => setStartDateTime(() => e.target.value)} required/>
                    <br />

                    <label htmlFor="startDateTime">StaEndrt Date time</label>
                    <br />
                    <input type="datetime-local" id="endDateTime" value={endDateTime} onChange={e => setEndDateTime(() => e.target.value)} required/>
                    <br />

                    <button type="submit" onClick={handleSubmit}> create event </button>
                </div>
            </Popup>
        </>
    );
}
