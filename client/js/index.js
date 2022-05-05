const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const button = document.getElementById("call");
const socket = io("http://192.168.1.144:8000");
const configuration = {
  iceServers: [{ urls: "stun:stun.google.com:19302" }],
};
const peerConnection = new RTCPeerConnection(configuration);
const callee = document.getElementById("callee");
socket.on('offer',offer => {
  console.log(offer)
  document.getElementsByTagName('body')[0].innerHTML = `
  <div class="card" style="width: 18rem;margin: auto;">
  <img class="card-img-top" src="../images/call.png" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">Join Call</h5>
    <p class="card-text">Respond to the received call from ...</p>
    <button href="#" class="btn btn-primary" style="margin:auto" id="joinCall">Answer</button>
  </div>
</div>
<div id="localstream">
<video autoplay controls="false" id="localvideo" />
</div>
<div id="remotestream">
<video autoplay controls="false" id="remoteVideo" />
</div>
  `
  })
button.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log(location.search);
  const config = {
    video: true,
    audio: true,
  };

  socket.on('answer3',async answer =>{
    console.log(answer);
        console.log('Set localdesc...')
        const remoteDesc = new RTCSessionDescription(JSON.parse(JSON.stringify(answer)));
        await peerConnection.setRemoteDescription(remoteDesc);
        console.log('Remote desc set successfully',remoteDesc);
        peerConnection.addEventListener('track',async event => {
          console.log('Track being received and gonna be set..')
          const [remoteStream] = event.streams;
          document.getElementById('remoteVideo').srcObject = remoteStream;
        })
  });
  const localStream = await navigator.mediaDevices.getUserMedia(config);
  if (localStream) {
    const localVideo = document.querySelector("video#localvideo");
    localVideo.srcObject = localStream;
    // const videoElement2 = document.querySelector("video#remoteVideo");
    // videoElement2.srcObject = localStream;
  }
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.send({
    type:'offer',
    offer,
    username,
    callee: callee.value,
  });
  peerConnection.addEventListener('icecandidate', event => {
    console.log('Sending icecandidates')
    if(event.candidate){
      socket.send({
        type:'candidate',
        candidate:event.candidate
      })
    }
  });
});

socket.emit('register',{
  username,
  callee
})




