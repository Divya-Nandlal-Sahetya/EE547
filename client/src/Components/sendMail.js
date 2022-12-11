import React, { useState, useEffect } from "react";
import "./sendMail.css";
import Popup from 'reactjs-popup';
//import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Buffer } from 'buffer';
//import { useDispatch } from "react-redux";
//import { closeSendMessage } from "../../features/mailSlice";
//import { db } from "../../firebase";
//import firebase from "firebase";
const tokens = require("./tokens")


function SendMail({isLoggedIn}) {
    const [token, setToken] = useState("")
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  //const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
        const fetchData = async () => {
            const token = await tokens.getToken(); // get the data from the api
            setToken(token); // set state with the result
        }
        fetchData().catch(console.error)
    }
    }, [isLoggedIn])
  const onSubmit = (formData) => {
    console.log(formData);
    const utf8Subject = `=?utf-8?B?${Buffer.from(formData.subject).toString('base64')}?=`;
  const messageParts = [
    'From: ee547_project team12 <team12ee547@gmail.co>',
    'To:' + formData.to,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    formData.message,
  ];
  const message = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMsg = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

    let requestBody = {
        "raw" : encodedMsg
    }
    fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+token
        },
        body: JSON.stringify(requestBody)
      })
      .then((response) => {
        
        console.log(response)
        return response.json()
      })
      .then(data => {
        console.log('list data:', data)
        alert("EMAIL SENT")
      })
  };

  return (
    <><button type="button" className="button" onClick={() => setOpen(o => !o)}>
          Send email
      </button><Popup open={open} closeOnDocumentClick onClose={closeModal} position="bottom left">
              <a className="close" onClick={closeModal}>
                  &times;
              </a>
              <div className="sendMail">
              <div className="sendMail-header">
                  <h3>New Message</h3>
                  {/* <CloseIcon
      onClick={() => dispatch(closeSendMessage())}
      className="sendMail-close"
    /> */}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                      name="to"
                      placeholder="To"
                      type="email"
                      {...register("to", { required: true })} />
                  {errors.to && <p className="sendMail-error">To is Required!</p>}
                  <input
                      name="subject"
                      placeholder="Subject"
                      type="text"
                      {...register("subject", { required: true })} />
                  {errors.subject && (
                      <p className="sendMail-error">Subject is Required!</p>
                  )}
                  <input
                      name="message"
                      placeholder="Message"
                      type="text"
                      className="sendMail-message"
                      {...register("message", { required: true })} />
                  {errors.message && (
                      <p className="sendMail-error">Message is Required!</p>
                  )}
                  <div className="sendMail-options">
                      <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className="sendMail-send"
                      >
                          Send
                      </Button>
                  </div>
              </form>
          </div>
                  
          </Popup></>
  );
}

export default SendMail;
