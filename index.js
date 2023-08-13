const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');

require('./db.js');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.static('public/uploads'));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

//routes
app.use('/auth', authRoutes);
app.use('/posts', postRouter);
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
