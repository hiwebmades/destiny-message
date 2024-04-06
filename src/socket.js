import { io } from "socket.io-client";

const URL = "https://destiny-message.onrender.com";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
