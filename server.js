import 'dotenv/config';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { setStaffUser } from './models/dataStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Whitelists (good for teaching: only accept known safe values)
app.locals.SERVICE_TYPES = ['Consultation', 'Follow-up', 'Therapy'];
app.locals.TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

app.get('/', (req, res) => {
  const isLoggedIn = req.cookies.staffAuth === 'true';
  res.redirect(isLoggedIn ? '/booking' : '/login');
});

app.use(authRoutes);
app.use(bookingRoutes);

app.use((req, res) => {
  res.status(404).send('Not Found');
});

async function start() {
  // For a simple classroom demo, we load staff credentials from environment variables.
  // IMPORTANT: We never store or log a plain-text password in code.
  const staffEmail = process.env.STAFF_EMAIL;
  const staffPassword = process.env.STAFF_PASSWORD;

  if (!staffEmail || !staffPassword) {
    console.error('Missing STAFF_EMAIL or STAFF_PASSWORD environment variables.');
    console.error('Example (PowerShell):');
    console.error('$env:STAFF_EMAIL="staff@example.com"');
    console.error('$env:STAFF_PASSWORD="ChangeMe123!"');
    process.exit(1);
  }

  // Password hashing happens here (server-side). We store only the hash.
  //ChangeMe123!
  //bcrypt - hashing values js package
  //2^10 = 1024
  const passwordHash = await bcrypt.hash(staffPassword, 12)
  console.log(passwordHash);
  setStaffUser({ email: staffEmail.trim().toLowerCase(), passwordHash });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

start();
