import {gql} from '@apollo/client'

export const CREATE_PERSON = gql`
mutation personCreate(
    $fname: String!
    $lname: String
    $gpa: Float
    $emailid: String!
    $role: roleEnum
    )
    {
    personCreate(
        personInput:{
        fname:$fname
        lname:$lname
        gpa:$gpa
        role:$role
        emailid:$emailid
        }
        ){
            fname
            lname
            gpa
            role
            emailid
            name
        }
    }
`

export const CREATE_GRADEBOOK = gql`
mutation gradebookCreate(
    $subject: String
    $grade: String
    $gpa: Float
    $emailid: String!
    )
    {
    gradebookCreate(
        gradebookInput:{
        subject: $subject
        grade: $grade
        gpa: $gpa
        emailid: $emailid
        }
        ){
            emailid
            gpa
            subject
            grade
        }
    }
`
