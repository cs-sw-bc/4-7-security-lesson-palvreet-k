import bcrypt from 'bcrypt';
import { getStaffUser } from '../models/dataStore.js';

function showLogin(req, res) {
  res.render('login', {
    error: null,
    values: { email: '' }
  });
}

async function login(req, res) {
  // Server-side input validation (never rely on client-side validation).
  //Sanitizing by removing amy empty spaces/ newlines
  // if need you can normalize(make verything uniform)
  // if there is an email use that if not, use empty space '' 
  // then trim it 'abc.gmail.com.  ' to 'abc.gmail.com'
  const email = (req.body.email || '').trim().toLowerCase()
  // don't sanitize password
  const password = req.body.password || ''

  if (!email || !password) {
    return res.status(401).render('login', {
      error: 'Email and Password are required on server side.'
    });
  }

  if(!/^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$/.test(email)){
    return res.status(401).render('login', {
      error: 'Email must be properly formatted for server side.'
    });
  }

  const staffUser = getStaffUser();
  if (!staffUser || staffUser.email !== email) {
    return res.status(401).render('login', {
      error: 'Invalid credentials.',
      values: { email }
    });
  }

  // Password hashing check happens here. We compare the plain password to the stored hash.
  // IMPORTANT: We never log or store the plain password.
  // compare
  const valid = await bcrypt.compare(password, staffUser.passwordHash)
  // true if they match
  
  // if(password != staffUser.staffPassword){
  if(!valid){
    return res.status(401).render('login', {
      error: 'Invalid credentials.',
      values: { email }
    });
  }

  // Simple conceptual login: set a cookie.
  // This is intentionally NOT a production auth system (good for teaching).
  res.cookie('staffAuth', 'true', {
    httpOnly: true,
    sameSite: 'lax'
  });

  return res.redirect('/booking');
}

function logout(req, res) {
  res.clearCookie('staffAuth');
  res.redirect('/login');
}

export {
  showLogin,
  login,
  logout
};
