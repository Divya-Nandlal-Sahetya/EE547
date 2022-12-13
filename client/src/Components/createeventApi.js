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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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
import React, {
	useState,
	useEffect,
	useRef,
	Fragment,
	useReducer,
} from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
const tokens = require("./tokens");

export function CreateEvent({ isLoggedIn, setEventChanged }) {
	const [token, setToken] = useState("");
	const [events, setEvents] = useState([]);

	// Popup state vars
	const [open, setOpen] = useState(false);
	const closeModal = () => setOpen(false);

	useEffect(() => {
		if (isLoggedIn) {
			const fetchData = async () => {
				const token = await tokens.getToken(); // get the data from the api
				setToken(token); // set state with the result
			};
			fetchData().catch(console.error);
		}
	}, [isLoggedIn]);

	const [summary, setSummary] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [startDateTime, setStartDateTime] = useState(new Date());
	const [endDateTime, setEndDateTime] = useState(new Date());

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("########################Create event: ", summary);
		//   this.CreateEvent(isLoggedIn,summary,description,location,startDateTime,endDateTime)
		console.log("create event: ", isLoggedIn, token);
		console.log("summaryRef.current.value: ", summaryRef.current.value);
		console.log("start.current.value: ", startTimeRef);
		if (token !== undefined && token !== "") {
			let start = new Date(startDateTime).toISOString().substring(0, 16);
			let end = new Date(endDateTime).toISOString().substring(0, 16);
			console.log(start);
			let todo = {
				summary: summaryRef.current.value,
				location: locationRef.current.value,
				description: descriptionRef.current.value,
				start: {
					dateTime: start + ":00-07:00",
					timeZone: "America/Los_Angeles",
				},
				end: {
					dateTime: end + ":00-07:00",
					timeZone: "America/Los_Angeles",
				},
			};

			console.log(todo);
			fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
				body: JSON.stringify(todo),
			})
				.then((response) => {
					console.log(response);
					return response.json();
				})
				.then((data) => {
					console.log("create data:", data);
					setEvents(data.items);
					setEventChanged((prev) => !prev);
					closeModal();
				});
		}
	};

	const [value, setValue] = React.useState(dayjs("2014-08-18T21:11:54"));

	const BootstrapDialog = styled(Dialog)(({ theme }) => ({
		"& .MuiDialogContent-root": {
			padding: theme.spacing(2),
			width: "500px",
		},
		// '.MuiInputBase-input' :{
		//     height: '2.1rem',
		//     // padding: 'unset',
		//     marginLeft: '5px',
		// },
		"&.MuiOutlinedInput-root": {
			height: "50px",
		},
		"& .MuiDialogActions-root": {
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
							position: "absolute",
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

	const [descriptionReq, setDescriptonReq] = useState(false);
	const [summaryReq, setSummaryReq] = useState(false);
	const [locationReq, setLocationReq] = useState(false);
	const [startTimeReq, setStartTimeReq] = useState(new Date());
	const [endTimeReq, setEndTimeReq] = useState(new Date());

	const summaryRef = useRef();
	const descriptionRef = useRef();
	const locationRef = useRef();
	const startTimeRef = useRef();
	const endTimeRef = useRef();
	const [selectedDate, handleDateChange] = useState(new Date());

	const handleChange = (newValue) => {
		setValue(newValue);
	};

	const dialogueRef = useRef();

	return (
		<>
			<Button
				variant="contained"
				className="button"
				onClick={() => setOpen((o) => !o)}
				style={{ marginBottom: "5px" }}
			>
				Create Event
			</Button>
			<BootstrapDialog
				ref={(node) => {
					dialogueRef.current = node;

					console.log(dialogueRef);
				}}
				onClose={() => setOpen(false)}
				aria-labelledby="customized-dialog-title"
				open={open}
			>
				<BootstrapDialogTitle
					id="customized-dialog-title"
					onClose={() => setOpen(false)}
				>
					Create Event Form
				</BootstrapDialogTitle>
				<DialogContent dividers>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Stack spacing={5}>
							<TextField
								label="Summary"
								// onChange={e => setSummary(e.target.value)}
								inputRef={summaryRef}
								required={summaryReq}
								// values={summary}
								error={summaryReq}
							/>
							<TextField
								label="Description"
								// values={description}
								inputRef={descriptionRef}
								// onChange={e => setDescription(e.target.value)}
								required={descriptionReq}
								error={descriptionReq}
							/>
							<TextField
								label="Location"
								// values={location}
								inputRef={locationRef}
								// onChange={e => setLocation(e.target.value)}
								required={locationReq}
								error={locationReq}
							/>
							<DateTimePicker
								label="Start Time"
								inputRef={startTimeRef}
								value={startDateTime}
								onChange={(e) => console.log(e)}
								renderInput={(params) => <TextField {...params} />}
								error={startTimeReq}
								required={startTimeReq}
							/>
							<DateTimePicker
								label="End Time"
								inputRef={endDateTime}
								value={endDateTime}
								onChange={(e) => console.log(e)}
								renderInput={(params) => <TextField {...params} />}
								error={endTimeRef}
								required={endTimeRef}
							/>
							{/* <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                <DateTimePicker value={startDateTime} onChange={setEndDateTime} />
                            </MuiPickersUtilsProvider>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                <DateTimePicker value={endDateTime} onChange={setEndDateTime}/>
                            </MuiPickersUtilsProvider> */}
						</Stack>
					</LocalizationProvider>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleSubmit}>
						Create Event
					</Button>
				</DialogActions>
			</BootstrapDialog>
		</>
	);
}
