//====LIST DEPENDENCIES===//

const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const url = process.env.MONGOLAB_URI;
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const Activity = require('./models/activity');
const uniqueValidator = require('mongoose-unique-validator');
const Category = require('./models/category');
const User = require('./models/user.js');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

//====SET APP ENGINE===//

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());

//====START SESSION===//

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

//====MONGOOSE PROMISE===//

mongoose.Promise = require('bluebird');

//====USE MONGOOSE TO CONNECT TO URL===//

  mongoose.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
  }
});

//====REDIRECT TO SPLASH WHEN AT ROOT===//

app.get('/', function(req, res) {
  res.redirect('/api/splash');
});

app.use(function(req, res, next) {
  console.log('I dont like programming anymore');
  next();
})


//====RENDER SPLASHPAGE===//

app.get('/api/splash', function(req, res) {
  User.find({}).then(function(users) {
    Category.find({}).then(function(categories) {
      Activity.find({}).then(function(activities) {
        console.log(activities);
        res.render('splash', {
          users: users,
          categories: categories,
          activities: activities,
        })
      });
    });
  });
});

//====RENDER SIGNUP PAGE===//

app.get('/api/signup', function(req, res) {
  User.find({}).then(function(users) {
    Category.find({}).then(function(categories) {
      Activity.find({}).then(function(activities) {
        console.log(activities);
        res.render('signup', {
          users: users,
          categories: categories,
          activities: activities,
        })
      });
    });
  });
});

//====POST TO SIGNUP PAGE===//

app.post('/api/signup', function(req, res) {
  User.create({
    username: req.body.username,
    password: req.body.password,
  }).then(function(user) {
    req.username = user.username;
    req.session.authenticated = true;
}).then(user => {
  res.redirect('/api/login')
});
});

//====RENDER LOGIN PAGE===//

app.get('/api/login', function(req, res) {
  if (req.session && req.session.authenticated) {
    var user = User.findOne({
        username: req.session.username,
        password: req.session.password
      }).then(function(user) {
      if (user) {
        req.session.username = req.body.username;
        req.session.userId = user.dataValues.id;
        username = req.session.username;
        userid = req.session.userId;
        res.render('home', {
          user: user
        });
      }
    })
  } else {
    res.redirect('/api/login')
  }
})

//====POST LOGIN FOR USER===//

app.post('/api/login', function(req, res) {
  username = req.body.username,
  password = req.body.password,
  User.findOne({
      username: username,
      password: password
  }).then(user => {
    if (user.password == password) {
      req.session.username = username;
      req.session.userId = user.dataValues.id;
      req.session.authenticated = true;
      console.log(req.session);

      res.redirect('/api/home');
    } else {
      res.redirect('/api/login');
      console.log("This is my session", req.session)
    }
  })
})

//====CREATE NEW CATEGORY===//

app.post('/api/home', function(req, res) {
  Category.create({
    activity_type: req.body.category,
    // activities: req.params,
  }).then(activity => {
    res.redirect('/api/home')
  });
});

//====RENDER HOME PAGE===//

app.get('/api/home', function(req, res) {
  User.find({}).then(function(users) {
    Category.find({}).then(function(categories) {
      Activity.find({}).then(function(activities) {
        console.log(activities);
        res.render('home', {
          users: users,
          categories: categories,
          activities: activities,
        })
      });
    });
  });
});

//====CREATE ACTIVITY===//

app.post('/api/:activity/:_id', function(req, res) {
  Activity.create({
    activity_name: req.body.activity,
    quantity: req.body.quantity,
    metric: req.body.metric,
    category: req.params.activity,
    // dates: req.params.activity
  }).then(activity => {
    console.log("about to log categories");
    res.redirect('/api/:activity/:_id')
  });
});

//====RENDER ACTIVITY PAGE===//

app.get('/api/:activity/:_id', function(req, res) {
  User.find({}).then(function(users) {
    Category.findOne({activity_type: req.params.activity}).then(function(categories) { Activity.find({category: req.params.activity}).then(function(activities) {
        res.render('activity', {
          users: users,
          activities: activities,
        })
     });
    });
  });
});

//====RENDER SPECIFIC ACTIVITY===//

app.get('/api/:activity', function(req, res) {
  User.find({}).then(function(users) {
    Category.findOne({activity_type: req.params.activity}).then(function(categories) { Activity.find({ activity_name: req.params.activity
    }).then(function(activities) {
          res.render('date', {
            users: users,
            categories: categories,
            activities: activities
          })
      });
    });
  });
});


app.listen(process.env.PORT);
console.log('starting applicaiton.  Good job!');

module.exports = app;
