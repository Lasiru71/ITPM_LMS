const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/enrollments', require('./routes/enrollment.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));

app.use(require('./middleware/error.middleware'));

module.exports = app;