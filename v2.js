Router.configure({
  layoutTemplate: 'DefaultLayout',
  template: 'DefaultTemplate'
});

Router.route('/', function(){
  this.render('home');
});

Router.route('live', function(){
  this.render('live');
});

Router.route('home', function(){
  this.render('home');
});

Router.route('login', function(){
  this.render('login');
});

Router.route('register', function(){
  this.render('register');
});

Router.route('buy_points', function(){
  this.render('buy_points');
});


if (Meteor.isClient) {

  Meteor.setTimeout(function(){
  }, 1000);

  var controller;
  var updater = function(){
    var current_points = Meteor.user().points;
    var points_minus_one = current_points - 1;
    if(current_points >= 1){
      Meteor.call('update_points_in_db', points_minus_one);
    }
  };

  Tracker.autorun(function() {
    Meteor.subscribe('points');
    Meteor.subscribe('email');
    Meteor.subscribe('username');
  });

  Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var username = $('[name=username]').val();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        var p = 0;
        Accounts.createUser({
            username: username,
            email: email,
            password: password,
        }, 
        function(error){
            if(error){
              console.log(error.reason);
          } else {
              Router.go('live');
          }
        });
      }
  });

  Template.defaultLayout.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
      }
  });

  Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
            $('.login_error').text(error.reason)
          } else {
            Router.go('live');
          }
        });
      }
  });

  Template.live.helpers({
    user: function(){
      if(Meteor.user())
      return Meteor.user().username;
    },
    live_points: function(){
      if(Meteor.user())
      return Meteor.user().points;
    }
  });

  Template.live.events({
    'click #add_100': function(){
      if(Meteor.user())
      Meteor.call('add_100');
    },
    'click #time_flow_button': function(){
      if(Meteor.user())
      controller = Meteor.setInterval(updater, 1000);
    },
    'click #stop_button': function(){
      if(Meteor.user())
      Meteor.clearInterval(controller);
    }  
  });

  window.onbeforeunload = function() {
    if(Meteor.user())
    Meteor.call('update_database_on_destroy', Meteor.user().points, Meteor.userId());
    return null;
  };

}

if (Meteor.isServer) {

  Accounts.onCreateUser(function(options, user) {
       if(!options || !user) {
        console.log('error creating user');
        return;
    } else {
        user.points = 0;
    }
    return user;
  });
  // Meteor Methods here --------------------------------

  Meteor.methods({
    add_100: function(){
      var old_points = Meteor.user().points;
      Meteor.users.update(Meteor.userId(), {$set: {points: old_points + 100}});
    },
    update_database_on_destroy: function(sec, id){
      Meteor.users.update(id, {$set: {points: sec}});
    },
    get_email: function(){
      return Meteor.user().email
    },
    update_points_in_db: function(x){
      Meteor.users.update(Meteor.userId(), {$set: {points: x}});
    }    
  });

  // ----------------------------------------------------

  Meteor.publish('email', function() {
    if(this.userId)
    return Meteor.users.find({}, {fields: {email: 1}});
  });

  Meteor.publish('username', function() {
    if(this.userId)
    return Meteor.users.find({}, {fields: {username: 1}});
  });

  Meteor.publish('points', function() {
    if(this.userId)
    return Meteor.users.find({}, {fields: {points: 1}});
  });
}



