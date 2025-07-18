const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const devRoutes = require('./routes/devRoutes');
app.use('/api/dev', devRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });
