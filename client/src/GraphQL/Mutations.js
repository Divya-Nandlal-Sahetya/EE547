import {gql} from '@apollo/client'

export const CREATE_PERSON = gql`
mutation personCreate(
    $fname: String!
    $lname: String
    $gpa: Float
    $email: String!
    $role: roleEnum
    )
    {
    personCreate(
        personInput:{
        fname:$fname
        lname:$lname
        gpa:$gpa
        role:$role
        email:$email
        }
        ){
            fname
            lname
            gpa
            role
            email
            name
        }
    }
`
