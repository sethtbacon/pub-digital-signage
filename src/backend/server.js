const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('config');

// Create Express app
const app = express();

// Set port from config or default to 3000
const PORT = process.env.PORT || config.get('server.port') || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Add API routes here
// app.use('/api/games', require('./api/routes/games'));
// app.use('/api/visitors', require('./api/routes/visitors'));
// app.use('/api/drinks', require('./api/routes/drinks'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../../public');
  app.use(express.static(staticPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;