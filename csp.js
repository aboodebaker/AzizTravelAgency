const policies = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://maps.googleapis.com',
  ],
  'child-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': [
    "'self'",
    'https://*.stripe.com',
    'https://raw.githubusercontent.com',
    'https://your-payload-cms-url.com',
    'https://hook.eu2.make.com/smd5pbv5py9cm3nnp4arddtkqfgnma24', // Added Make.com
    'https://api.make.com', // Added Make.com API
  ],
  'font-src': ["'self'"],
  'frame-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://hooks.stripe.com',
    'https://v6.exchangerate-api.com/v6/b5221dff56cd44bc2e30e2db/latest/USD',
  ],
  'connect-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://api.stripe.com',
    'https://maps.googleapis.com',
    'https://api.openai.com', // Added OpenAI API
    'https://your-payload-cms-url.com', // Added Payload CMS
    'https://hook.eu2.make.com/smd5pbv5py9cm3nnp4arddtkqfgnma24', // Added Make.com
    'https://api.make.com', // Added Make.com API
    'https://api.brevo.com/v3/contacts',
    'https://v6.exchangerate-api.com/v6/b5221dff56cd44bc2e30e2db/latest/USD',
  ],
}

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(' ')}`
    }
    return ''
  })
  .join('; ')
