require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


const app = express();
const port = process.env.PORT || 3000;



// Define the Person schema
const personSchema = new mongoose.Schema({
  name: String,
  
});

const Person = mongoose.model('Person', personSchema);

// Configure Express to use session and Passport for authentication
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {

    User.findOne({ username }, (err, user) => {
        if (err) return done(err);
    
        if (!user) {
          return done(null, false, { message: 'Invalid username' });
        }
    
        if (!bcrypt.compareSync(password, user.passwordHash)) {
          return done(null, false, { message: 'Invalid password' });
        }
    
        return done(null, user);
      });
//   const usernameFromDB = 'admin';
//   const passwordHashFromDB = bcrypt.hashSync('password', 10); // Hashed password from the database

//   if (username === usernameFromDB && bcrypt.compareSync(password, passwordHashFromDB)) {
//     return done(null, { username: usernameFromDB });
//   } else {
//     return done(null, false, { message: 'Invalid credentials' });
//   }
}));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  done(null, { username });
});

// Middleware to protect routes that require authentication
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// Express routes for CRUD operations on "persons"
app.use(express.json());

// Create a new person
app.post('/api', isAuthenticated, async (req, res) => {
  try {
    const { name, password } = req.body;
    const person = new Person({ name, password });
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Retrieve persons with optional query parameters
app.get('/api/persons', isAuthenticated, async (req, res) => {
  try {
    const query = req.query.name ? { name: req.query.name } : {};
    const persons = await Person.find(query);
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a person by ID
app.put('/api/persons/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, age } = req.body;
    const updatedPerson = await Person.findByIdAndUpdate(req.params.id, { name, age }, { new: true });
    res.json(updatedPerson);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a person by ID
app.delete('/api/persons/:id', isAuthenticated, async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndRemove(req.params.id);
    res.json(deletedPerson);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Set up Mongoose connection and start server
mongoose
  .connect("mongodb://127.0.0.1:27017/messagesDB")
  .then(result => {
    app.listen(port, () => {
      console.log(`Successfully connected to database, Server is running on port ${port}`);
    });
  })
  .catch(err => console.log(err));