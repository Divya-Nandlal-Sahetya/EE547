// import { Button } from "@mui/material";
// import React, { useState, useEffect, useRef, Fragment } from "react";
// import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';
// import dayjs from 'dayjs';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// // import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// import PropTypes from 'prop-types';
// import { styled } from '@mui/material/styles';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';
// import DateFnsUtils from '@date-io/date-fns'; // choose your lib
// import {
//   DateTimePicker,
//   MuiPickersUtilsProvider,
// } from '@material-ui/pickers';
// const tokens = require("./tokens")

import { Button } from "@mui/material";
import React, { useState, useEffect, useRef, Fragment } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
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

    const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));


    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
            width: '500px',
            
        },
        '&.MuiOutlinedInput-root' : {
            height: '50px',
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    function BootstrapDialogTitle(props) {
        const { children, onClose, ...other } = props;

        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    }

    BootstrapDialogTitle.propTypes = {
        children: PropTypes.node,
        onClose: PropTypes.func.isRequired,
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {

        setOpen(false);
        // handleSubmit()
    };


    const [descriptionReq, setDescriptonReq] = useState(false)
    const [summaryReq, setSummaryReq] = useState(false)
    const [locationReq, setLocationReq] = useState(false)
    const [startTimeReq, setStartTimeReq] = useState(false)
    const [endTimeReq, setEndTimeReq] = useState(false)

    const summaryRef = useRef()
    const descriptionRef = useRef()
    const locationRef = useRef()
    const startTimeRef = useRef()
    const endTimeRef = useRef()
    const [selectedDate, handleDateChange] = useState(new Date());

    const handleChange = (newValue) => {
        setValue(newValue);
    };
    return (
            <>
            {
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
}
        </>
    )
    }
