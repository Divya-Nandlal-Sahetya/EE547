import React, {useEffect, useState} from "react";
import {useQuery,gql} from '@apollo/client'
import {LOAD_STUDENT} from '../GraphQL/Queries'



function GetStudents() {
    
    const {error,loading,data} = useQuery(LOAD_STUDENT,{variables:{id:"638bbb44b1542940d0d1fc80"}}); 
    const [student,setStudents] = useState([]);


    useEffect(() => {
        if (data) {
        setStudents(data.student);
        }
        if (error) {
            console.log(error);
        }

    }, [data])


    return (
    <div> 
        {/* {student.map((student) => { */}
        return <h1>{student.name+" "+ student.gpa}  </h1>
    {/* })} */}

    </div>
    );
}

export default GetStudents;