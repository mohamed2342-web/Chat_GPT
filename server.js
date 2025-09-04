const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

// إعداد تقديم الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// نقطة نهاية للمحادثة الذكية
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ reply: response.data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: 'خطأ في الاتصال بـ OpenAI' });
    }
});

// نقطة نهاية توليد النصوص
app.post('/api/textgen', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',
                prompt,
                max_tokens: 200
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ result: response.data.choices[0].text });
    } catch (err) {
        res.status(500).json({ error: 'خطأ في توليد النص' });
    }
});

// نقطة نهاية الترجمة الذكية (باستخدام GPT)
app.post('/api/translate', async (req, res) => {
    const { text, target } = req.body;
    try {
        const prompt = `ترجم النص التالي إلى ${target}:\n${text}`;
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',
                prompt,
                max_tokens: 200
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ result: response.data.choices[0].text });
    } catch (err) {
        res.status(500).json({ error: 'خطأ في الترجمة' });
    }
});

// نقطة نهاية توليد الصور (DALL·E)
app.post('/api/imagegen', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                prompt,
                n: 1,
                size: "512x512"
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ url: response.data.data[0].url });
    } catch (err) {
        res.status(500).json({ error: 'خطأ في توليد الصورة' });
    }
});

// نقطة نهاية تحليل البيانات (نموذج أولي فقط)
app.post('/api/dataanalysis', async (req, res) => {
    // هنا يمكن إضافة معالجة البيانات لاحقًا
    res.json({ result: 'تحليل البيانات قادم قريبًا.' });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على http://localhost:${PORT}`);
});