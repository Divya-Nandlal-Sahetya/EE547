import {gql} from '@apollo/client'

export const LOAD_STUDENTS = gql`
query{
    students{
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
query($id:ID!){
    student(id:$id){
    fname
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
