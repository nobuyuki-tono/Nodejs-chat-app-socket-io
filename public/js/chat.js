const socket = io();

// elements
const form = document.getElementById("form");
const input = document.getElementById("input");
const button = document.getElementById("form-btn");
const sendLocationBtn = document.getElementById("send-location-btn");
const messages = document.getElementById("messages");
const sidebar = document.getElementById("sidebar");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationMessageTemplate = document.getElementById(
  "location-message-template"
).innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;

// option
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Add auto scroll
const autoScroll = () => {
  // New message element
  const newMessage = messages.lastElementChild;

  // Get height of the new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // visible height
  const visibleHeight = messages.offsetHeight;

  // Height of messages container
  const containerHeight = messages.scrollHeight;

  // How far have I scrolled
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

// Listen messege event
socket.on("message", msg => {
  // console.log(msg);
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    message: msg.text,
    createdAt: moment(messages.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

// Listen location message

socket.on("locationMessage", location => {
  console.log("Location", location);
  const html = Mustache.render(locationMessageTemplate, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

// Listen

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  sidebar.innerHTML = html;
});

// Emit send message event
form.addEventListener("submit", e => {
  e.preventDefault();

  // disable
  button.setAttribute("disabled", "disabled");

  const msg = e.target.elements.message.value;

  socket.emit("sendMsg", { username, msg }, error => {
    //enable
    button.removeAttribute("disabled");
    input.value = "";
    input.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered");
  });
});

// Emit send location event

sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supoorted by your browser");
  }

  sendLocationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      locationMsg => {
        sendLocationBtn.removeAttribute("disabled");
        console.log("Location shared");
      }
    );
  });
});

// Emit join event

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

// socket.on("countUpdated", count => {
//   console.log("The count has been updated", count);
// });

// const btn = document.getElementById("increment");
// btn.addEventListener("click", () => {
//   console.log("Clicked");
//   socket.emit("increment");
// });
