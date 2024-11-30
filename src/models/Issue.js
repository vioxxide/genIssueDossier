const mongoose = require('mongoose');

    const issueSchema = new mongoose.Schema({
      topic: String,
      data: Object
    });

    module.exports = mongoose.model('Issue', issueSchema);
