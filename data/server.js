// خادم Node.js بسيط لربط الموقع مع OpenAI API
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config(); // لتحميل متغيرات البيئة من ملف .env

const app = express();
const PORT = 3000;

const HF_API_KEY = process.env.HF_API_KEY; // ضع المفتاح في ملف .env

app.use(cors());
app.use(bodyParser.json());

// دالة مساعدة لإرسال الطلبات إلى Hugging Face
async function queryHuggingFace(model, inputs) {
    const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        { inputs },
        {
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
}

// نقطة نهاية المحادثة الذكية
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: 'يرجى إرسال رسالة.' });

    try {
        const data = await queryHuggingFace('mistralai/Mistral-7B-Instruct-v0.1', userMessage);
        const aiReply = data.generated_text || data[0]?.generated_text || 'لا يوجد رد.';
        res.json({ reply: aiReply });
    } catch (error) {
        res.status(500).json({ error: error.response?.data?.error || 'حدث خطأ أثناء الاتصال بـ Hugging Face.' });
    }
});

// نقطة نهاية توليد النصوص
app.post('/api/textgen', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: 'يرجى إرسال نص البداية.' });

    try {
        const data = await queryHuggingFace('mistralai/Mistral-7B-Instruct-v0.1', prompt);
        const result = data.generated_text || data[0]?.generated_text || 'لا يوجد نص.';
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.response?.data?.error || 'حدث خطأ أثناء توليد النص.' });
    }
});

// نقطة نهاية الترجمة الذكية
app.post('/api/translate', async (req, res) => {
    const { text, target } = req.body;
    if (!text || !target) return res.status(400).json({ error: 'يرجى إرسال النص واللغة المستهدفة.' });

    try {
        const prompt = `ترجم النص التالي إلى ${target}:\n${text}`;
        const data = await queryHuggingFace('mistralai/Mistral-7B-Instruct-v0.1', prompt);
        const result = data.generated_text || data[0]?.generated_text || 'لا يوجد ترجمة.';
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.response?.data?.error || 'حدث خطأ أثناء الترجمة.' });
    }
});

// نقطة نهاية توليد الصور
app.post('/api/imagegen', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: 'يرجى إرسال وصف الصورة.' });

    try {
        const data = await queryHuggingFace('stabilityai/stable-diffusion-2', prompt);
        // الصورة غالباً في data[0].image أو data.image أو data[0].generated_image
        const image = data[0]?.image || data.image || data[0]?.generated_image || data.generated_image || null;
        if (!image) return res.status(500).json({ error: 'لم يتم توليد صورة.' });
        res.json({ image });
    } catch (error) {
        res.status(500).json({ error: error.response?.data?.error || 'حدث خطأ أثناء توليد الصورة.' });
    }
});

// نقطة نهاية تحليل البيانات
app.post('/api/dataanalysis', async (req, res) => {
    const dataInput = req.body.data;
    if (!dataInput) return res.status(400).json({ error: 'يرجى إرسال البيانات.' });

    try {
        const prompt = `حلل البيانات التالية وأعطني ملخصاً:\n${dataInput}`;
        const data = await queryHuggingFace('mistralai/Mistral-7B-Instruct-v0.1', prompt);
        const result = data.generated_text || data[0]?.generated_text || 'لا يوجد تحليل.';
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.response?.data?.error || 'حدث خطأ أثناء تحليل البيانات.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
