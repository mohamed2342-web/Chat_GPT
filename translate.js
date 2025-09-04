document.getElementById("translateForm").onsubmit = async function(e) {
    e.preventDefault();
    const text = document.getElementById("translateInput").value;
    const targetLang = document.getElementById("targetLang").value;
    const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang })
    });
    const result = await response.json();
    document.getElementById("translateResult").textContent = result.translated;
};