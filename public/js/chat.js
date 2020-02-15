const socket = io();

// elements
const form = document.getElementById("form");
const input = document.getElementById("input");
const button = document.getElementById("form-btn");
const sendLocationBtn = document.getElementById("send-location-btn");
const messages = document.getElementById("messages");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationMessageTemplate = document.getElementById(
  "location-message-template"
).innerHTML;

socket.on("message", msg => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    message: msg.text,
    createdAt: moment(messages.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", url => {
  console.log("Location", url);
  const html = Mustache.render(locationMessageTemplate, {
    url: url
  });
  messages.insertAdjacentHTML("beforeend", html);
});

form.addEventListener("submit", e => {
  e.preventDefault();

  // disable
  button.setAttribute("disabled", "disabled");

  const msg = e.target.elements.message.value;

  socket.emit("sendMsg", msg, error => {
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

// socket.on("countUpdated", count => {
//   console.log("The count has been updated", count);
// });

// const btn = document.getElementById("increment");
// btn.addEventListener("click", () => {
//   console.log("Clicked");
//   socket.emit("increment");
// });
