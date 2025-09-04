// خادم Node.js بسيط لربط الموقع مع OpenAI API
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// نقطة نهاية المحادثة الذكية باستخدام Hugging Face Mistral-7B-Instruct
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: 'يرجى إرسال رسالة.' });

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
            {
                inputs: userMessage
            },
            {
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                }
            }
        );
        // الرد قد يكون في generated_text أو داخل مصفوفة
        const aiReply = response.data?.generated_text || response.data?.[0]?.generated_text || 'لا يوجد رد.';
        res.json({ reply: aiReply });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بـ Hugging Face.' });
    }
});

// نقطة نهاية توليد النصوص
app.post('/api/textgen', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: 'يرجى إرسال نص البداية.' });

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
            { inputs: prompt },
            {
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                }
            }
        );
        const result = response.data?.generated_text || response.data?.[0]?.generated_text || 'لا يوجد نص.';
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء توليد النص.' });
    }
});

// نقطة نهاية الترجمة الذكية (ترجمة عبر النموذج نفسه)
app.post('/api/translate', async (req, res) => {
    const { text, target } = req.body;
    if (!text || !target) return res.status(400).json({ error: 'يرجى إرسال النص واللغة المستهدفة.' });

    try {
        const prompt = `ترجم النص التالي إلى ${target}:\n${text}`;
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
            { inputs: prompt },
            {
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                }
            }
        );
        const result = response.data?.generated_text || response.data?.[0]?.generated_text || 'لا يوجد ترجمة.';
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء الترجمة.' });
    }
});

// نقطة نهاية توليد الصور (مثال باستخدام Stable Diffusion)
app.post('/api/imagegen', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: 'يرجى إرسال وصف الصورة.' });

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
            { inputs: prompt },
            {
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                }
            }
        );
        // الصورة ترجع غالباً على شكل base64 أو رابط
        const image = response.data?.[0]?.generated_image || response.data?.generated_image || null;
        res.json({ image });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء توليد الصورة.' });
    }
});

// نقطة نهاية تحليل البيانات (نموذج أولي)
app.post('/api/dataanalysis', async (req, res) => {
    const data = req.body.data;
    if (!data) return res.status(400).json({ error: 'يرجى إرسال البيانات.' });

    try {
        const prompt = `حلل البيانات التالية وأعطني ملخصاً:\n${data}`;
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
            { inputs: prompt },
            {
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                }
            }
        );
        const result = response.data?.generated_text || response.data?.[0]?.generated_text || 'لا يوجد تحليل.';
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء تحليل البيانات.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
