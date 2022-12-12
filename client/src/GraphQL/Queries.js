import {gql} from '@apollo/client'

export const LOAD_STUDENTS = gql`
query{
    students(limit:10){
        fname
        lname
        name
        gpa
    }
    }
`

export const LOAD_TEACHERS = gql`
query{
    teachers{
        fname
        lname
        name
    }
    }
`

export const LOAD_COURSES = gql`
query{
    courses{
    name
    }
    }
`

export const LOAD_STUDENT = gql`
query($emailid:String!){
    student(emailid:$emailid){
    fname
    lname
    name
    gpa
    
    }
    }
`

export const LOAD_TEACHER = gql`
query($id:ID!){
    teacher(id:$id){
    fname
    }
    }
`

export const LOAD_COURSE = gql`
query($id:ID!){
    course(id:$id){
    name
    }
    }
`
