require('dotenv').config();

require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'Chat_GPT-main')));
app.use(bodyParser.json());

// نقطة نهاية المحادثة باستخدام Hugging Face
app.post('/api/chat', async (req, res) => {
  const { message} = req.body;
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      { inputs: message},
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
}
}
);

    // الرد من النموذج
    const reply = response.data.generated_text || 'لم يتم الحصول على رد.';
    res.json({ reply});
} catch (err) {
    console.error('خطأ في الاتصال بـ Hugging Face:', err.message);
    res.status(500).json({ error: 'خطأ في الاتصال بالخادم.'});
}
});

app.listen(PORT, () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});

// نقطة نهاية توليد النصوص (OpenAI)
app.post('/api/textgen', async (req, res) => {
  const { prompt} = req.body;
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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
}
}
);
    res.json({ result: response.data.choices[0].text});
} catch (err) {
    res.status(500).json({ error: 'خطأ في توليد النص'});
}
});

// نقطة نهاية الترجمة الذكية (OpenAI)
app.post('/api/translate', async (req, res) => {
  const { text, target} = req.body;
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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
}
}
);
    res.json({ result: response.data.choices[0].text});
} catch (err) {
    res.status(500).json({ error: 'خطأ في الترجمة'});
}
});

// نقطة نهاية توليد الصور (OpenAI DALL·E)
app.post('/api/imagegen', async (req, res) => {
  const { prompt} = req.body;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
        n: 1,
        size: '512x512'
},
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
}
}
);
    res.json({ url: response.data.data[0].url});
} catch (err) {
    res.status(500).json({ error: 'خطأ في توليد الصورة'});
}
});

// نقطة نهاية تحليل البيانات (نموذج أولي)
app.post('/api/dataanalysis', async (req, res) => {
  res.json({ result: 'تحليل البيانات قادم قريبًا.'});
});

// نقطة نهاية باستخدام Hugging Face API (مثال)
app.post('/api/huggingface', async (req, res) => {
  const { input} = req.body;
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',
      { inputs: input},
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
}
}
);
    res.json({ result: response.data});
} catch (err) {res.status(500).json({ error: 'خطأ في الاتصال بـ Hugging Face'});
}
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});
