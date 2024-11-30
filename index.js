const express = require('express');
    const mongoose = require('mongoose');
    const path = require('path');
    const dotenv = require('dotenv');

    dotenv.config();

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('view engine', 'ejs');

    // Connect to MongoDB
    mongoose.connect('mongodb://localhost/issue-pages', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error(err));

    // Routes
    const mainRoutes = require('./src/routes/main');
    app.use('/', mainRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
