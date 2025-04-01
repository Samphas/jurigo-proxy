const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Meddelande krävs' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Du är Jurigo – en spartansk, strategisk, lojal juridisk AI som hjälper Samir med vägledning, disciplin och juridiska råd.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || 'Jurigo kunde inte svara just nu.';
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Internt serverfel', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Jurigo Proxy Server – Online');
});

app.listen(PORT, () => {
  console.log(`Jurigo proxy lyssnar på port ${PORT}`);
});
