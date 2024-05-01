const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const { authenticateToken, authorizeRoles } = require('./middleware/auth.middleware');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/eventsdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());

app.use('/users', userRoutes);
app.use('/events', authenticateToken, eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
