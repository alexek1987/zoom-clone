const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;


var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
});

let myVideoStream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
  }).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected', (userId) => {
    connectToNewUser(userId, stream);
    })
  })


peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
  // console.log(userId);
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
}

// send messages
let text = $('input')
console.log(text)

$('html').keydown((event) => {
  if(event.which == 13 && text.val().length !==0) {
    // console.log(text.val())
    socket.emit('message', text.val());
    text.val('')
  }
});

socket.on('createMessage', message => {
  // console.log('this is from server', message)
  $('.messages').append(`<li style="list-style: none;" class="message"><b>Big Boss</b><br/>${message} </li>`)
  scrollToBottom()
})

const scrollToBottom = () => {
  let scroll = $('.main_chat_window');
  scroll.scrollTop(scroll.prop("scrollHeight"));
}

//Mute audio
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
    my
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main_mute_button').innerHTML = html;
}

// stop video

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true
  }
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
    <i class="share fas fa-video-slash"></i>
    <span>Share Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}






