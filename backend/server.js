// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { groq } = require('./utils/groqClient'); 


// *** Note the "./routes/…" paths here ***
const weatherRoutes = require('./routes/weather.js');
const recordRoutes  = require('./routes/records.js');




const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/weather', weatherRoutes);
app.use('/records', recordRoutes);


app.post('/assistant', async (req, res, next) => {
  try {
    const { locationName, temp, description, lat, lon } = req.body;

    // Build the messages array
    const messages = [
      {
        role: "system",
        content: "You are a concise AI assistant that gives outfit and safety advice based on current weather."
      },
      {
        role: "user",
        content: `
Location: ${locationName} (lat ${lat.toFixed(2)}, lon ${lon.toFixed(2)})
Weather: ${description}, ${Math.round(temp)}°C

Please respond with:
1) What to wear.
2) Any safety or comfort tips (UV, wind, rain, etc).
`.trim()
      }
    ];

    // Use groq-sdk to create a chat completion
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",           // or your granted Groq model
      messages,
      max_tokens: 150
    });

    // Extract the assistant’s reply
    const advice = completion.choices?.[0]?.message?.content.trim()
                 || "Sorry, no advice returned.";

    res.json({ advice });
  } catch (err) {
    next(err);
  }
});


const PORT = process.env.PORT || 4000;
// backend/server.js
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🗄️ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => console.error('❌ DB connection error:', err));
