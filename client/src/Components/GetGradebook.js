import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { LOAD_GRADEBOOK } from "../GraphQL/Queries";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { Button, Card, CardContent } from "@mui/material";
import Form from "./Form";
import Popup from "reactjs-popup";

function GetGradebook({ emailid,isTeacher }) {
	const { error, loading, data } = useQuery(LOAD_GRADEBOOK, {
		variables: { emailid },
	});

	const [records, setRecords] = useState([]);
  // Popup state vars
	const [open, setOpen] = useState(false);
	const closeModal = () => setOpen(false);

  useEffect(() => {
    console.log('isTeacher: ', isTeacher)
  }, [isTeacher])
	useEffect(() => {
		console.log("getGradebook.js 2 | data", data);
		if (data) {
			console.log("***********************************", data);
			setRecords(data.gradebooks);
		}
		if (error) {
			console.log(error);
		}
	}, [data]);

	if (records.length === 0) {
		return (
			<div>
				<h3>No records found</h3>
			</div>
		);
	}
	return (
		<>
			{isTeacher ? (
				<>
					<Button
						variant="outlined"
						onClick={() => setOpen((o) => !o)}
						style={{ marginBottom: "5px" }}
					>
						Add Record
					</Button>

					<Popup
						open={open}
						closeOnDocumentClick
						onClose={closeModal}
						position="bottom left"
					>
						<a className="close" onClick={closeModal}>
							&times;
						</a>
						<Form />
					</Popup>
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

export default GetGradebook;
