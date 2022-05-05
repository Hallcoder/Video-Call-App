socket.on("offer", async (offer) => {
  const localStream2 = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  console.log('Set remote video Trial...')
  localStream2.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream2);
    });
 const remoteVideo = document.getElementById("remoteVideo");
 remoteVideo.srcObject = localStream2;
  const button1 = document.getElementById("joinCall");
  button1.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(offer);
    const config = {
      video: true,
      audio: true,
    };
    const peerConnection = new RTCPeerConnection(config);
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.send({
      answer,
      type: "answer",
    });
    socket.emit("answer2", answer);
    socket.on("candidate", async (candidate) => {
        peerConnection.addIceCandidate(candidate);
    });
  });
});
// socket.on('offer',offer => {
//     console.log(offer)
//     window.location.href = './joinCall.html'
//     })
