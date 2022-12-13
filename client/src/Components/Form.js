import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_GRADEBOOK } from "../GraphQL/Mutations";

function Form() {
	const [subject, setSubject] = useState();
	const [gpa, setGPA] = useState();
    const [email, setEmail] = useState();
	const [grade,setGrade] = useState();
	const [gradeBookCreate, { error }] = useMutation(CREATE_GRADEBOOK);


	const addGradebook = () => {
		gradeBookCreate({
			variables: {
				gpa: Number(gpa),
				emailid: email,
				subject: subject,
				grade: grade
			},
		});
		if (error) {
			console.log(error);
		}
	};


	console.log(subject,gpa,email,grade)
	return (
		
		<div>
			<input
				type="text"
				placeholder="Subject"
				onChange={(e) => {
					setSubject(e.target.value);
				}}
			/>

			<input
				type="float"
				placeholder="GPA"
				onChange={(e) => {
					setGPA(e.target.value);
				}}
			/>

			<input
				type="text"
				placeholder="Grade"
				onChange={(e) => {
					setGrade(e.target.value);
				}}
			/>
			<input
				type="email"
				placeholder="EmailID"
				onChange={(e) => {
					setEmail(e.target.value);
				}}
			/>
			<button onClick={addGradebook}>Create Entry in gradebook</button>
		</div>
	);
}

export default Form;
