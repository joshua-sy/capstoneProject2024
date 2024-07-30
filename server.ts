// import express from 'express';
// import bodyParser from 'body-parser';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(bodyParser.json());

// app.post('/api/codegpt', async (req, res) => {
//   const { query } = req.body;

//   if (!query) {
//     console.error('Error: Query is required');
//     return res.status(400).json({ error: 'Query is required' });
//   }

//   try {
//     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//       model: 'gpt-3.5-turbo',
//       prompt: query,
//       max_tokens: 150,
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use your actual API key here
//       },
//     });

//     console.log('OpenAI response:', response.data);
//     res.json({ response: response.data.choices[0].text });
//   } catch (error) {
//     console.error('Error:', error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
