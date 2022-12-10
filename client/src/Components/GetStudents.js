import React, {useEffect, useState} from "react";
import {useQuery,gql} from '@apollo/client'
import {LOAD_STUDENTS} from '../GraphQL/Queries'



function GetStudents() {
    
    const {error,loading,data} = useQuery(LOAD_STUDENTS); 
    const [students,setStudents] = useState([]);


    useEffect(() => {
        if (data) {
        setStudents(data.students);
        }
        if (error) {
            console.log(error);
        }

    }, [data])


    return (
    <div> {students.map((student) => {
        return <h1>{student.name+" "+student.name + " "+ student.gpa}  </h1>
    })}

    </div>
    );
}

export default GetStudents;