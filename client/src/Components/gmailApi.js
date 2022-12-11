// import { getToken } from "./tokens";
const tokens = require("./tokens")

export const getMyGmailList = async () => {
  try {
    const token = await tokens.getToken();
    console.log(
      "gmail.js 49 | getting gmail data with token",
      token
    );
    const request = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await request.json();
    console.log("gmail.js 24 | got gmail data", data);
    return data;
  } catch (error) {
    console.log("gmail.js 35 | error getting gmail data", error);
    return error.message;
  }
};
