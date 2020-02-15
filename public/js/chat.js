const socket = io();

socket.on("message", welcomeMsg => {
  console.log(welcomeMsg);
});

const form = document.getElementById("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  const msg = e.target.elements.message.value;

  socket.emit("sendMsg", msg);
});

document.querySelector("#send-location-btn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supoorted by your browser");
  }

  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
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
