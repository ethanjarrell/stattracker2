//====LIST DEPENDENCIES===//

const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const uniqueValidator = require('mongoose-unique-validator');
const Activity = require('./models/activity');
const Category = require('./models/category');
const User = require('./models/user.js');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const url = process.env.MONGOLAB_URI;

//==========================//

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

//==========================//

//====START SESSION===//

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

//==========================//

//====MONGOOSE PROMISE===//

mongoose.Promise = require('bluebird');

//==========================//

//====USE MONGOOSE TO CONNECT TO URL===//

  mongoose.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
  }
});

//==========================//

//====REDIRECT TO SPLASH WHEN AT ROOT===//

app.get('/', function(req, res) {
  res.redirect('/api/splash');
});

app.use(function(req, res, next) {
  console.log('I dont like programming anymore');
  next();
})

//==========================//

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

//==========================//

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

//==========================//

//====RENDER LOGIN PAGE???===//

app.get('/api/login', function(req, res) {
  res.render('login');
});

//==========================//

//====RENDER LOGIN PAGE===//

app.get('/api/login', function(req, res) {
  if (req.session && req.session.authenticated) {
    User.findOne({
        username: req.session.username,
        password: req.session.password
      }).then(function(user) {
      if (user) {
        req.session.username = req.body.username;
        var username = req.session.username;
        var userid = req.session.userId;
        res.render('login', {
          user: user
        });
      }
    })
  } else {
    res.redirect('/api/splash')
  }
})

//==========================//

//====POST LOGIN FOR USER===//

app.post('/api/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({
      username: username,
      password: password,
  }).then(user => {
    console.log(user);
    if (user.password == password) {
      req.session.username = username;
      req.session.authenticated = true;
      console.log(req.session);

      res.redirect('/api/home');
    } else {
      res.redirect('/api/login');
      console.log("This is my session", req.session)
    }
  })
})

//==========================//

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

//==========================//

//====CREATE NEW CATEGORY===//

app.post('/api/home', function(req, res) {
  Category.create({
    activity_type: req.body.category,
    user: req.session.username,
  }).then(activity => {
    res.redirect('/api/home')
  });
});

//==========================//

//====DELETE CATEGORY===//

app.get('/delete/:activity', function(req, res) {
  Category.findOneAndRemove({activity_type: req.params.activity}).then(activity => {
    res.redirect('/api/home')
  });
});

//==========================//

//====RENDER HOME PAGE===//

app.get('/api/home', function(req, res) {
  User.find({username: req.session.username}).then(function(users) {
    Category.find({user: req.session.username}).then(function(categories) {
      Activity.find({user: req.session.username}).then(function(activities) {
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

//==========================//

//====CREATE ACTIVITY===//

app.post('/api/:activity/:_id', function(req, res) {
  Activity.create({
    activity_name: req.body.activity,
    quantity: req.body.quantity,
    metric: req.body.metric,
    month: req.body.month,
    day: req.body.day,
    day_of_week: req.body.day_of_week,
    year: req.body.year,
    hour: req.body.hour,
    minute: req.body.minute,
    am_pm: req.body.am_pm,
    category: req.params.activity,
    user: req.session.username,
    // dates: req.params.activity
  }).then(activity => {
    console.log("about to log categories");
    res.redirect('/api/:activity/:_id')
  });
});

//==========================//

//====DELETE ACTIVITY===//

app.get('/:_id', function(req, res) {
  Activity.remove({
    activity_name: req.params._id
  }).then(activity => {
    res.redirect('/api/home')
  });
});

//==========================//

//====RENDER ACTIVITY PAGE===//

app.get('/api/:activity/:_id', function(req, res) {
  User.findOne({username: req.session.username}).then(function(users) {
    Category.findOne({activity_type: req.params.activity}).then(function(categories) { Activity.find({category: req.params.activity}).then(function(activities) {
        res.render('activity', {
          users: users,
          activities: activities,
        })
     });
    });
  });
});

//==========================//

//====RENDER SPECIFIC ACTIVITY===//

app.get('/api/:activity', function(req, res) {
  User.find({username: req.session.username}).then(function(users) {
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

//==========================//

//====RENDER WEEKLY VISUALIZATION FOR ACTIVITY===//

app.get('/api/:month', function(req, res) {
  User.find({username: req.session.username}).then (function(users) {
    Category.findOne({activity_type: req.params.activity}).then (function(categories) { Activity.findOne({ month: req.params.activity
    }).then(function(activities) {
          res.render('activity_comparison', {
            users: users,
            categories: categories,
            activities: activities
          })
      });
    });
  });
});

//==========================//

//====APP LOGOUT - DESTROY SESSION===//

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {})
  res.render('splash');
  console.log(req.session);
});
//==========================//

//====APP LISTEN ON ENVIRONMENT PORT===//

app.listen(process.env.PORT || 3000);
console.log('starting applicaiton.  Good job!');

//==========================//


//====EXPORT APP===//

module.exports = app;
