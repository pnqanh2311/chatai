const chatBody = document.querySelector(".chatbody");
const messageIn = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const Input = document.querySelector("#file-input");
const UploadWrapper = document.querySelector(".file-upload-wrapper");
const CancelButton = UploadWrapper.querySelector("#file-cancel");
const chatToggler = document.querySelector("#chat-toggler");
const closeChat = document.querySelector("#close-chatbot");

// API
const API_KEY = "AIzaSyCq3RgGIkABhCncPIO8BzIlakUerTUHrfs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;



//  chat history
const chatHistory = [];
const initialInputHeight = messageIn.scrollHeight;
// Initialize message and  data
const userData = {
  message: null,
  file: {
    data: null,
  },
};
// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Generate bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  

  
  try {
    // Fetch response from API
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerText = apiResponseText;

    //  chat history
    chatHistory.push({
      role: "model",
      parts: [{ text: apiResponseText }],
    });
  }  finally {
    userData.file = {};
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// Handle outgoing user messages
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageIn.value.trim();
  messageIn.value = "";
  messageIn.dispatchEvent(new Event("input"));
  UploadWrapper.classList.remove("file-uploaded");

  // display user message
  const messageContent = `<div class="message-text"></div>
                          ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

  const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
  outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // Simulate bot response with thinking indicator after a delay
  setTimeout(() => {
    const messageContent = `<img src="chatassisstant.png" class="chatbot-logo" width="50" height="60" alt="chat logo">
          <div class="message-text">
            <div class="thinking-indicator">
             <p> Typing...</p>
            </div>
          </div>`;

    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(incomingMessageDiv);
  }, 600);
};


messageIn.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && !e.shiftKey && userMessage && window.innerWidth > 768) {
    handleOutgoingMessage(e);
  }
});


//  file upload cancel
CancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});


sendMessage.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => Input.click());
closeChat.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
