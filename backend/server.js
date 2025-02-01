const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const apartmentRoutes = require('./routes/apartmentRoutes'); 
const authRouter = require('./routes/authRoutes');
const favoritesRouter = require('./routes/favoritesRoutes');
const multer = require('multer');
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/apartments', apartmentRoutes); 
app.use('/api/auth', authRouter);
app.use('/favorites', favoritesRouter);
app.options('*', cors());




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
app.get('/test', (req, res) => {
  res.send('Test route works!');
});