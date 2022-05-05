const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let Users = [];
io.on("connection", (socket) => {
 socket.on('register', user => {
   user.socketId = socket.id;
   Users.push(user);
   console.log('user saved!')
   console.log(Users)
 })
 io.on('disconnect', (socket) =>{
   const user = Users.find(user => user.socketId == socket.id)
   Users.splice(Users.indexOf(user),1);
 })
  socket.on("message", (msg) => {
    const data = JSON.parse(JSON.stringify(msg));
    switch (data.type) {
      case "offer":
        const callee = findUser(data.callee);
        console.log('callee',callee);
        io.to(callee.socketId).emit("offer", data.offer);
        break;
      case "answer":
        socket.on("answer2", (answer) => {
          io.emit('message',answer)
          io.emit("answer3", answer);
        });
        break;
      case 'candidate':
        console.log('candidates on the server are being received')
        io.emit("candidate",data.candidate);
    }
  });
});
function findUser(username) {
  return Users.find((user) => (user.username).toLowerCase() === username.toLowerCase());
}
server.listen(8000, () => {
  console.log("listening on port 8000");
});
