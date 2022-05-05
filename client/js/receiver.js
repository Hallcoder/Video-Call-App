const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const Cbutton = document.getElementById("call");
const Rbutton = document.getElementById('register');
const callee = document.getElementById("callee");
const socket = io("http://192.168.1.144:8000");


socket.onmessage = e =>{
  handleSignallingData(JSON.parse(e.data))
}

function handleSignallingData(data){
   switch(data.type){
     case "offer":
       peerConnection.setRemoteDescription(data.offer);
       createAndSendAnswer();
       break;
     case 'candidate':
       peerConnection.addIceCandidate(data.candidate)
   }
}
 async function createAndSendAnswer(){
  const answer = await peerConnection.createAnswer();
  peerConnection.setLocalDescription(answer);
  sendData({
    type:'answer',
    answer
  })
}

const configuration = {
  iceServers: [{ urls:["stun:stun1.l.google.com:19302",
    "stun:stun1.voiceeclipse.net:3478",
    "stun:stun2.l.google.com:19302",
   " stun:stun3.l.google.com:19302",
    "stun:stun4.l.google.com:19302" 
  ]}
  ],
};
const peerConnection = new RTCPeerConnection(configuration);
// socket.on('offer',offer => {
//   console.log(offer)
//   document.getElementsByTagName('body')[0].innerHTML = `
//   <div class="card" style="width: 18rem;margin: auto;">
//   <img class="card-img-top" src="../images/call.png" alt="Card image cap">
//   <div class="card-body">
//     <h5 class="card-title">Join Call</h5>
//     <p class="card-text">Respond to the received call from ...</p>
//     <button href="#" class="btn btn-primary" style="margin:auto" id="joinCall">Answer</button>
//   </div>
// </div>
// <div id="localstream">
// <video autoplay controls="false" id="localvideo" />
// </div>
// <div id="remotestream">
// <video autoplay controls="false" id="remoteVideo" />
// </div>
//   `
//   })
Cbutton.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log(location.search);
  AddUserMediaToStream()
  peerConnection.ontrack(e =>{
    const remoteVideo = document.getElementById("remoteVideo");
    remoteVideo.srcObject = e.track
  })
  peerConnection.onicecandidate(e => {
    if(e.candidate == null){
      return
    }
    sendData({
      type:'send_candidate',
      candidate:e.candidate
    })
    sendData({
      type:'join_call'
    })
  })
});
async function AddUserMediaToStream(){
  const config = {
    video: true,
    audio: true,
  };
 const localStream  = await navigator.mediaDevices.getUserMedia(config);
 localStream.getTracks().forEach(track => {
   peerConnection.addTrack(track,localStream);
 })
 const localVideo = document.querySelector("video#localvideo");
 localVideo.srcObject = localStream; 
}
function sendData(data){
  data.username = username
  socket.send({data})
}