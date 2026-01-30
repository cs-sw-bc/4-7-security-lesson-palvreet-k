
function validateLogin(e) {
  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document.querySelector('input[name="password"]').value;
  const errorEl = document.getElementById('clientError');

  errorEl.textContent = '';
  // if user has typed in an email/password
  if(!email || !password){
    errorEl.textContent = 'Email and password are mandatory'
    return false
  }
  if(email.length>100){
     errorEl.textContent = 'Email cannot be greater than 100 characters'
    return false
  }
  // email format- REGEX
  //abcd1243@gmail.com
  if(!/^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$/.test(email)){
    e.preventDefault();
     errorEl.textContent = 'Email format is incorrect'
    return false
  }
  return true;
}

function validateBooking(e) {
  const name = document.querySelector('input[name="clientName"]').value.trim();
  const email = document.querySelector('input[name="clientEmail"]').value.trim();
  const serviceType = document.querySelector('select[name="serviceType"]').value;
  const date = document.querySelector('input[name="date"]').value;
  const timeSlot = document.querySelector('select[name="timeSlot"]').value;
  const notes = document.querySelector('textarea[name="notes"]').value.trim();
  const errorEl = document.getElementById('clientError');

  errorEl.textContent = '';

  return true;
}

