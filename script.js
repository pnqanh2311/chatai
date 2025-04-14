const chatBody = document.querySelector(".chatbody");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.getElementById("send-message");

// API Configuration
const API_KEY = "AIzaSyCq3RgGIkABhCncPIO8BzIlakUerTUHrfs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const userData = {
    message: null,
    file: {
      data: null,
    },}
// Function to create message elements
const createMessageElement = (content,... className) => {
    const div = document.createElement("div");
    div.classList.add("message",... className);
    div.innerText = content;
    return div;
};

// Function to send user message and get AI response
const handleOutgoingMessage = async () => {
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Display user message
    chatBody.appendChild(createMessageElement(userMessage, "user-message"));
    messageInput.value = "";
    chatBody.scrollTo(0, chatBody.scrollHeight); // Scroll to the bottom

   

    // Fetch AI response
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AIzaSyCq3RgGIkABhCncPIO8BzIlakUerTUHrfs}`
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const botMessage = data.response; // Adjust based on your API response structure

        // Display bot response
        chatBody.appendChild(createMessageElement(botMessage, "bot-message"));
        chatBody.scrollTo(0, chatBody.scrollHeight); // Scroll to the bottom
    } catch (error) {
        console.error("Error fetching AI response:", error);
        chatBody.appendChild(createMessageElement("Sorry, I couldn't get a response.", "bot-message"));
    }
};

// Event listener for send button
sendMessageButton.addEventListener("click", handleOutgoingMessage);

// Event listener for Enter key
messageInput