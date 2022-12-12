import React, { useState, useEffect } from "react";
import Popup from 'reactjs-popup';
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Buffer } from 'buffer';
const tokens = require("./tokens")


function SendMail({isLoggedIn}) {
    const [token, setToken] = useState("")
    const [open, setOpen] = useState(false);
    const [destinationAddr, setDestinationAddr] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
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
    <><Button variant="contained" className="button" onClick={() => setOpen(o => !o)}
                style={{ marginBottom: '5px' }}>
                Send Email
            </Button>
    <Popup open={open} closeOnDocumentClick onClose={closeModal} position="bottom left">
              <a className="close" onClick={closeModal}>
                  &times;
              </a>
              <div>
                    <label htmlFor="To">To</label>
                    <br />
                    <input type="text" id="to" value={destinationAddr} onChange={e => setDestinationAddr(e.target.value)} required/>
                    <br />

                    <label htmlFor="Subject">Subject</label>
                    <br />
                    <textarea type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required/>
                    <br />

                    <label htmlFor="body">Body</label>
                    <br />
                    <input type="text" id="body" value={body} onChange={e => setBody(e.target.value)} />
                    <br />
                    <button type="submit" onClick={handleSubmit}> create event </button>
                </div>
          </Popup></>
  );
}

export default SendMail;
