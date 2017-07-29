
  //Global Variables
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  const mongoose = require('mongoose');
  const passport = require('passport');
  const mustacheExpress = require('mustache-express');
  const bcrypt = require('bcryptjs');
  const BasicStrategy = require('passport-http').BasicStrategy;
  const Activity = require('./models/activity');
  const Users = require('./models/users');

  //View Engine
  app.engine('mustache', mustacheExpress());
  app.set('view engine', 'mustache');
  app.set('views', './views');
  app.use(express.static('public'));

  //Body Parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  //Mongoose
  mongoose.Promise = require('bluebird');
  mongoose.connect('mongodb://localhost:27017/stattracker');
  let db = mongoose.connection;

  //Passport Authentication
  passport.use(new BasicStrategy(
  function(username, password, done) {
    Users.findOne({username: username }, function(err, user) {
      if (user && bcrypt.compareSync(password, user.password)){
        return done(null, user);
      }
      return done(null, false);
    });
  }));


  //Routes


  app.get('/api/auth', passport.authenticate('basic', {session: false}), function (req, res) {
    res.send('Authentication successfull, ' + req.user.username);
  });

  app.get('/', function(req, res) {
  res.send('Failed, please use /api/activities');
  });

  app.get('/api/activities', passport.authenticate('basic', {session: false}), function(req, res) {
  Activity.find().then(function(activities){
    res.render('activitiesAll', {activities: activities,});
    });
  });

  app.post('/api/activities', passport.authenticate('basic', {session: false}), function(req, res) {
  Activity.create({name: req.body.name, quantity: req.body.quantity}).then(activity =>{
    res.redirect('/api/activities');
    });
  });

  app.put('/api/activities/:activity_id', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.findOneAndUpdate({name: req.body.name, quantity: req.body.quantity,}).then(activity =>{
    res.json(activity);
    });
  });

  app.delete('/api/activities/:activity_id', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.findOneAndRemove({name: req.body.name, quantity: req.body.quantity,}).then(activity =>{
    res.json(activity);
    });
  });

  app.get('/api/activities/id/:id', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.findById().then(function(activities){
    res.render('activitiesOne', {activities: activities});
    });
  });

  app.get('/api/activities/date/:date', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.find(req.params.date).then(function(err, activity){
    if (err){
    res.send(err);
    }
    res.json(activity);
    });
  });

  //Port Listen

  app.listen(3023, function(req, res){
  console.log("Listening on Port 3023")
  });
