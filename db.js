const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/e-healthcare';// edit it acording to the need
// MongoDB Connection
const connectToDb = ()=>mongoose.connect(URI);
  
 module.exports = connectToDb; 