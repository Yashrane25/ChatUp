const socket = io();

const clintsTotal = document.getElementById("clint-total");

const messageContainer = document.getElementById("message-container");

const nameInput = document.getElementById("name-input");

const messageForm = document.getElementById("message-form");

const messageInput = document.getElementById("message-input");

const messageTone = new Audio("/message-tone.mp3");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clints-total", (data) => {
  clintsTotal.innerHTML = `Total Clients: ${data}`;
});

function sendMessage() {
  if (messageInput.value === "") {
    return;
  }
  console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };

  socket.emit("message", data);
  addMessageToUi(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  //   console.log(data);
  messageTone.play();
  addMessageToUi(false, data);
});

function formatTime(date) {
  const messageDate = new Date(date);
  let hours = messageDate.getHours();
  const minutes = messageDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; //0 becomes 12
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

function addMessageToUi(isOwnMessage, data) {
  clearFeedback();
  const element = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
          <p class="message">
            ${data.message}
            <span>${data.name} :${formatTime(data.dateTime)}</span>
          </p>
        </li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing...`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing...`,
  });
});

messageInput.addEventListener("blure", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const elements = `<li class="message-feedback">
          <p class="feedback" id="feedback"> ${data.feedback} </p>
        </li>`;

  messageContainer.innerHTML += elements;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
