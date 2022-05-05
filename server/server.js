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
  socket.on('message',msg => {
    const data = JSON.parse(JSON.stringify(msg));

    switch(data.type){
      case 'store_user':
        
    }
  })
});
function findUser(username) {
  return Users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
    );
}
server.listen(8000, () => {
  console.log("listening on port 8000");
});

  































// socket.on("register", (user) => {
  //   user.socketId = socket.id;
  //   Users.push(user);
  //   console.log(Users[0]);
  // });
  // socket.on("disconnect", (socket) => {
  //   const user = Users.find((user) => user.socketId == socket.id);
  //   Users.splice(Users.indexOf(user), 1);
  //   console.log("user left..");
  // });
  // socket.on("message", (msg) => {
  //   const data = JSON.parse(JSON.stringify(msg));
  //   switch (data.type) {
  //     case "offer":
  //       const callee = findUser(data.callee);
  //       io.to(callee.socketId).emit("offer", data.offer);
  //       break;
  //     case "answer":
  //       socket.on("answer2", (answer) => {
  //         io.emit("message", answer);
  //         io.emit("answer3", answer);
  //       });
  //       break;
  //     case "candidate":
  //       const candidate = data.candidate;
  //       console.log("candidates on the server are being received");
  //       socket.on("candidate", (candidate) => {
  //         socket.to(candidate.socketId).emit("candidate", candidate);
  //       });
  //       break;
  //     case "video":
  //       console.log(data);
  //       io.emit("video", data.localStream2);
  //   }
  // });