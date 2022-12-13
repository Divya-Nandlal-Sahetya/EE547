import React, { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_GRADEBOOK } from "../GraphQL/Mutations";

import { Button } from "@mui/material";
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

function Form({ setOpen, open, closeModal}) {
	const [subject, setSubject] = useState("");
	const [gpa, setGPA] = useState("");
	const [email, setEmail] = useState("");
	const [grade, setGrade] = useState("");

	const [subjectReq, setSubjectReq] = useState(false);
	const [gpaReq, setGPAReq] = useState(false);
	const [emailReq, setEmailReq] = useState(false);
	const [gradeReq, setGradeReq] = useState(false);

	const subjectRef = useRef();
	const gpaRef = useRef();
	const emailRef = useRef();
	const gradeRef = useRef();

	const [gradeBookCreate, { error }] = useMutation(CREATE_GRADEBOOK);

	// Popup state vars
	// const [open, setOpen] = useState(false);
	// const closeModal = () => setOpen(false);

	const addGradebook = () => {

		console.log({
			gpa: Number(gpaRef.current.value),
			emailid: emailRef.current.value,
			subject: subjectRef.current.value,
			grade: gradeRef.current.value,
		})
		gradeBookCreate({
			variables: {
				gpa: Number(gpaRef.current.value),
				emailid: emailRef.current.value,
				subject: subjectRef.current.value,
				grade: gradeRef.current.value,
			},
		});
		if (error) {
			console.log(error);
		}else {
			closeModal()
		}
	};

	const BootstrapDialog = styled(Dialog)(({ theme }) => ({
		"& .MuiDialogContent-root": {
			padding: theme.spacing(2),
			width: "500px",
		},
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
	console.log(subject, gpa, email, grade);
	return (
		<>
			{/* <Button variant="contained" className="button" onClick={() => setOpen(o => !o)}
                style={{ marginBottom: '5px' }}>
                Add Record
            </Button> */}
			<BootstrapDialog
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
								label="Subject"
								inputRef={subjectRef}
								required={subjectRef}
								error={subjectReq}
							/>
							<TextField
								label="GPA"
								inputRef={gpaRef}
								required={gpaReq}
								error={gpaReq}
							/>
							<TextField
								label="Email"
								inputRef={emailRef}
								required={emailReq}
								error={emailReq}
							/>
							<TextField
								label="Grade"
								inputRef={gradeRef}
								required={gradeReq}
								error={gradeReq}
							/>
						</Stack>
					</LocalizationProvider>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={addGradebook}>
						Add Record
					</Button>
				</DialogActions>
			</BootstrapDialog>
		</>
		// <div>
		// 	<input
		// 		type="text"
		// 		placeholder="Subject"
		// 		onChange={(e) => {
		// 			setSubject(e.target.value);
		// 		}}
		// 	/>

		// 	<input
		// 		type="float"
		// 		placeholder="GPA"
		// 		onChange={(e) => {
		// 			setGPA(e.target.value);
		// 		}}
		// 	/>

		// 	<input
		// 		type="text"
		// 		placeholder="Grade"
		// 		onChange={(e) => {
		// 			setGrade(e.target.value);
		// 		}}
		// 	/>
		// 	<input
		// 		type="email"
		// 		placeholder="EmailID"
		// 		onChange={(e) => {
		// 			setEmail(e.target.value);
		// 		}}
		// 	/>
		// 	<button onClick={addGradebook}>Create Entry in gradebook</button>
		// </div>
	);
}

export default Form;
