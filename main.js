// مثال: دالة عامة لإرسال طلبات إلى الخادم
async function sendRequest(endpoint, data) {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return response.json();
}