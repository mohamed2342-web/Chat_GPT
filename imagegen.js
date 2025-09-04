document.getElementById("imagegenForm").onsubmit = async function(e) {
    e.preventDefault();
    const prompt = document.getElementById("imagePrompt").value;
    const response = await fetch("/api/imagegen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });
    const result = await response.json();
    document.getElementById("imagegenResult").src = result.image_url;
};