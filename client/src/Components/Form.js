import React, {useState} from "react";
import {useMutation} from '@apollo/client'
import {CREATE_PERSON} from '../GraphQL/Mutations'


function Form () {

    const [fname,setFName] = useState("");
    const [lname,setLName] = useState("");
    const [gpa,setGPA] = useState("");
    const [role,setRole] = useState("");
    const [personCreate,{error}] = useMutation(CREATE_PERSON);

    const addPerson = () => {
        personCreate({
            variables:{
                fname:fname,
                lname:lname,
                gpa:Number(gpa),
                role:role
            }
        });
        if (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="First Name"
                onChange={(e) => {setFName(e.target.value)}}
            />
            
            <input
                type="text"
                placeholder="Last Name"
                onChange={(e) =>{setLName(e.target.value)}}
            />
            
            <input
                type= "text"
                placeholder="GPA"
                onChange={(e) => {setGPA(e.target.value)}}
            />

            <input
                type="enum"
                placeholder="role"
                onChange={(e) => {setRole(e.target.value)}}
            />
            <button onClick={addPerson}>Create User</button>
        </div>
    );
}

export default Form;