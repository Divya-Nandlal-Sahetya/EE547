import React from 'react'
import { Link } from 'react-router-dom'
import uscbg from './uscbg.png'
import '../App.css'

export default function SignInPage() {
    return (
        <div  className="text-center m-5-auto">
            <img src={uscbg} alt="USC Logo" className="usc-logo"/>
            <h1 type="header"  >Welcome to Your Dashboard </h1>
            <form  action="/home">
                <p>
                    <h2> Enter USC NetID / Email </h2>
                </p>
                <p>
                    <label>username/email</label><br/>
                    <input type="text-center" name="first_name" required />
                </p>
                <p>
                    <label>Password</label>
                    <Link to="/forget-password"><label className="right-label">Forgot password?</label></Link>
                    <br/>
                    <input id="password" type="password" name="password" required />
                </p>
                <p>
                    <button id="sub_btn" type="submit" Link to = "/dashboard">Login</button>
                </p>
                <h3>OR</h3>
                <p> <Link to="/googlesign"> <label className='right-label'>Continue with Google</label></Link></p>
            </form>
            <footer className='footer'>
                <p className='right-label'>First time? <Link to="/register">Create an account</Link>.</p>
               
            </footer>
        </div>
    )
}