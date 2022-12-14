import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { LOAD_GRADEBOOKS } from "../GraphQL/Queries";
import { LOAD_GRADEBOOK } from "../GraphQL/Queries";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { Button, Card, CardContent } from "@mui/material";
import Form from "./Form";

function GetGradebook({ emailid }) {
	// Popup state vars
	const [open, setOpen] = useState(false);
	const closeModal = () => setOpen(false);

	const isTeacher = sessionStorage.getItem("isTeacher");

	const res1 = useQuery(LOAD_GRADEBOOK, {
		variables: { emailid },
	});

	const res2 = useQuery(LOAD_GRADEBOOKS);

	const [records, setRecords] = useState([]);
	console.log("*", res1, res2);

	useEffect(() => {
		if (res1.data) {
			setRecords(res1.data.gradebook);
		}
		if (res1.error) {
			console.log(res1.error);
		}
	}, [res1]);

	useEffect(() => {
		if (res2.data) {
			setRecords(res2.data.gradebooks);
		}
		if (res2.error) {
			console.log(res2.error);
		}
	}, [res2]);

	if (records.length === 0) {
		return (
			<div>
				<h3>No records found</h3>
			</div>
		);
	}

	if (isTeacher==true) {
		return (
			<>
				{true ? (
					<>
						<Button
							variant="outlined"
							onClick={() => setOpen((o) => !o)}
							style={{ marginBottom: "5px" }}
						>
							Add Record
						</Button>
						<Form setOpen={setOpen} open={open} closeModal={closeModal} />
					</>
				) : (
					<></>
				)}

				<TableContainer
					sx={{
						height: 200,
					}}
				>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell align="auto">Email</TableCell>
								<TableCell align="auto">Subject</TableCell>
								<TableCell align="auto">GPA</TableCell>
								<TableCell align="auto">Grade</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{records.map((record) => {
								return (
									<TableRow
										key={record.subject}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell align="auto">{record.emailid}</TableCell>
										<TableCell align="auto">{record.subject}</TableCell>
										<TableCell align="auto">{record.gpa}</TableCell>
										<TableCell align="auto">{record.grade}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</>
		);
	} else {
		return (
			<>
				<TableContainer
					sx={{
						height: 200,
					}}
				>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell align="auto">Subject</TableCell>
								<TableCell align="auto">GPA</TableCell>
								<TableCell align="auto">Grade</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{records.map((record) => {
								return (
									<TableRow
										key={record.subject}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell align="auto">{record.subject}</TableCell>
										<TableCell align="auto">{record.gpa}</TableCell>
										<TableCell align="auto">{record.grade}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</>
		);
	}
}

export default GetGradebook;
