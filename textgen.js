document.getElementById("textgenForm").onsubmit = async function(e) {
    e.preventDefault();
    const prompt = document.getElementById("textPrompt").value;
    const response = await fetch("/api/textgen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });
    const result = await response.json();
    document.getElementById("textgenResult").textContent = result.text;
};