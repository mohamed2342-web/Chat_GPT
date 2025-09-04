document.getElementById("chatForm").onsubmit = async function(e) {
    e.preventDefault();
    const userInput = document.getElementById("userInput").value;
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput })
    });
    const result = await response.json();
    document.getElementById("chatResult").textContent = result.response;
};