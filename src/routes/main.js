const express = require('express');
    const router = express.Router();
    const axios = require('axios');
    const Issue = require('../models/Issue');

    // Main page
    router.get('/', (req, res) => {
      Issue.find({}, (err, issues) => {
        if (err) return res.status(500).send(err);
        res.render('index', { issues });
      });
    });

    // Generate issue page
    router.post('/generate', async (req, res) => {
      const topic = req.body.topic;
      const prompts = [
        `Give me the top 10 arguments for ${topic}.`,
        `Give me the top 10 arguments against ${topic} and counter-arguments.`,
        `Give me the top 10 articles advocating for ${topic}.`,
        `Give me the top 10 YouTube videos advocating this issue.`,
        `Give me the top 10 bumper-sticker arguments for the issue.`,
        `Give me the top 10 organizations fighting for this issue.`,
        `Give me the top 10 organizations fighting against the issue.`,
        `Give me the top 10 news articles discussing polling trends for the issue.`
      ];

      const data = {};

      for (const prompt of prompts) {
        try {
          const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            prompt: prompt,
            max_tokens: 256
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
          });
          data[prompt] = response.data.choices[0].text.trim();
        } catch (error) {
          console.error(`Error fetching data for prompt "${prompt}":`, error);
          data[prompt] = 'Failed to fetch data';
        }
      }

      const issue = new Issue({ topic, data });
      await issue.save();

      res.redirect(`/view/${issue._id}`);
    });

    // View generated page
    router.get('/view/:id', async (req, res) => {
      const issue = await Issue.findById(req.params.id);
      if (!issue) return res.status(404).send('Issue not found');
      res.render('view', { issue });
    });

    // Index of all issues
    router.get('/index', async (req, res) => {
      const issues = await Issue.find();
      res.render('index', { issues });
    });

    module.exports = router;
