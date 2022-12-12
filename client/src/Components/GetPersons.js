import React, {useEffect, useState} from "react";
import {useQuery,gql} from '@apollo/client'
import {LOAD_STUDENT} from '../GraphQL/Queries'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from "@mui/material";
function GetPersons({emailid}) {
    
    const {error,loading,data} = useQuery(LOAD_STUDENT,{ variables: { emailid } }); 
    const [student,setStudents] = useState([]);

    useEffect(() => {
        console.log("GetPersons.js 2 | data", data);
        if (data) {
          console.log("HIIiiiiiiiiii",data)
            setStudents(data.student);

        }
        if (error) {
            console.log(error);
        }

    }, [data])

        return (
          // // <div>
          // //   {student.fname}
          // // </div>
          //   <Table Student Data>
          //     <thead>
          //       <h3>Your Data</h3>
          //       <tr>
          //         <th>First Name</th>
          //         <th>Last Name</th>
          //         <th>GPA</th>
          //       </tr>
          //     </thead>
          //     <tbody>
          //       <tr>
          //         <td>{student.fname}</td>
          //         <td>{student.lname}</td>
          //         <td>{student.gpa}</td>
          //       </tr>
          //     </tbody>
          //   </Table>
<Card style={{ marginBottom: '5px', marginTop: '5px'}}>
                    <CardContent style={{ padding: 'unset'}}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={student.name}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="h1"
                                variant="caption"
                                color="text.primary"
                              >
                                {student.gpa}
                              </Typography>
                              {/* {` — ${e.summary}`} */}
                            </React.Fragment>
                          }
                        />

                      </ListItem>
                    </CardContent>
                  </Card>
          );
        }

export default GetPersons;