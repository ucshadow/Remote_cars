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

Router.route('live1', function(){
  this.render('live1');
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

Router.route('wrtc', function(){
  this.render('wrtc');
});


if (Meteor.isClient) {

  Session.set('view', 'carnumber1');
  Session.set('peer_id', null);

  Meteor.setTimeout(function(){
  }, 1000);

  Tracker.autorun(function() {
    Meteor.subscribe('points');
    Meteor.subscribe('email');
    Meteor.subscribe('username');
    Meteor.subscribe('cars');
  });

  var c;
  var u = function(){
    // Server code
    if(Meteor.user().username === 'carnumber1'){
      var webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo',
        remoteVideosEl: 'remotesVideos',
        autoRequestMedia: true
      });
      console.log(webrtc);
      webrtc.joinRoom('carnumber1');
      webrtc.on('videoAdded', function (peer) {
        console.log('video added', peer);
        var x = '#' + peer.id;
        console.log(x);
        $(x).remove();
        });
      
      webrtc.on('channelMessage', function (peer, label, message) {
        console.log(peer);
        console.log(label);
        console.log(message);
        if (label !== 'text chat') return;
            else if (message.type == 'chat-to-car1') {
              $('#live').text(message.payload);
            }
          })

    } else {
      // Client code

      var a = [];
      var b = '';

      $(document).keypress(function(e){
          var w = e.which;
          if(a.indexOf(String.fromCharCode(w)) === -1){
            a.push(String.fromCharCode(w));
          }
          webrtc.sendDirectlyToAll('text chat', 'chat-to-car1', a.join(''));
      });

      $(document).keyup(function(e){
          var ind = a.indexOf(String.fromCharCode(e.which).toLowerCase());
          if (ind > -1) {
          a.splice(ind, 1);
      }
          webrtc.sendDirectlyToAll('text chat', 'chat-to-car1', a.join('')); 
          if(a.length <= 0){
             webrtc.sendDirectlyToAll('text chat', 'chat-to-car1', 'Nothing Pressed');
          }
      });
      $('#localVideo').remove();
      var webrtc = new SimpleWebRTC({
        remoteVideosEl: 'remotesVideos',
        autoRequestMedia: false
      });
      
      webrtc.joinRoom('carnumber1');
      webrtc.on('videoAdded', function(){
        var len = $('#remotesVideos').children().length;
        if(len > 1){
          for(var x = 1; x < len; x++){
            $('#remotesVideos').children()[x].remove()
          }
        }
      });

      remotesVideos.style.cssText = "-moz-transform: scale(-1, 1); \
      -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
      transform: scale(-1, 1); filter: FlipH;";
    }
  };
  var v = function(){
    // Server code
    if(Meteor.user().username === 'carnumber2'){
      var webrtc = new SimpleWebRTC({
        localVideoEl: 'localVideo',
        remoteVideosEl: 'remotesVideos',
        autoRequestMedia: true
      });
      console.log(webrtc);
      webrtc.joinRoom('carnumber2');
      webrtc.on('videoAdded', function (peer) {
        console.log('video added', peer);
        var x = '#' + peer.id;
        console.log(x);
        $(x).remove();
        });
      
      webrtc.on('channelMessage', function (peer, label, message) {
        console.log(peer);
        console.log(label);
        console.log(message);
        if (label !== 'text chat') return;
            else if (message.type == 'chat-to-car2') {
              $('#live').text(message.payload);
            }
          })

    } else {
      // Client code

      var a = [];
      var b = '';

      $(document).keypress(function(e){
          var w = e.which;
          if(a.indexOf(String.fromCharCode(w)) === -1){
            a.push(String.fromCharCode(w));
          }
          webrtc.sendDirectlyToAll('text chat', 'chat-to-car2', a.join(''));
      });

      $(document).keyup(function(e){
          var ind = a.indexOf(String.fromCharCode(e.which).toLowerCase());
          if (ind > -1) {
          a.splice(ind, 1);
      }
          webrtc.sendDirectlyToAll('text chat', 'chat-to-car2', a.join('')); 
          if(a.length <= 0){
             webrtc.sendDirectlyToAll('text chat', 'chat-to-car2', 'Nothing Pressed');
          }
      });
      $('#localVideo').remove();
      var webrtc = new SimpleWebRTC({
        remoteVideosEl: 'remotesVideos',
        autoRequestMedia: false
      });
      
      webrtc.joinRoom('carnumber2');
      webrtc.on('videoAdded', function(){
        var len = $('#remotesVideos').children().length;
        if(len > 1){
          for(var x = 1; x < len; x++){
            $('#remotesVideos').children()[x].remove()
          }
        }
      });

      remotesVideos.style.cssText = "-moz-transform: scale(-1, 1); \
      -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
      transform: scale(-1, 1); filter: FlipH;";
    }
  };

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
    },
  });

  Template.live.events({
    'click #add_100': function(){
      if(Meteor.user())
      Meteor.call('add_100');
    },
    'click #start_button': function(){
      if(Meteor.user()){
        var current_car = Session.get('view');
        if(Status.find({name: current_car}).fetch()[0]._is === 'idle'){
          Meteor.call('set_status_busy', current_car, Meteor.user().username);
          Meteor.call('live_updater', Meteor.userId(), Meteor.user().points);
        }
      }
    },
    'click #stop_button': function(){
      if(Status.find({name: Session.get('view')}).fetch()[0].by === Meteor.user().username){
        Meteor.call('stop_clicked');
        Meteor.call('set_status_idle', Session.get('view'));
        $('#start_button').attr("disabled", false);
      }
    }  ,
    'click #car1': function(){
      Session.set('view', 'carnumber1');
    },
    'click #car2': function(){
      Session.set('view', 'carnumber2');
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
    },
  });

  Template.live1.events({
    'click #add_100': function(){
      if(Meteor.user())
      Meteor.call('add_100');
    },
    'click #start_button': function(){
      if(Meteor.user()){
        var current_car = Session.get('view');
        if(Status.find({name: current_car}).fetch()[0]._is === 'idle'){
          Meteor.call('set_status_busy', current_car, Meteor.user().username);
          Meteor.call('live_updater', Meteor.userId(), Meteor.user().points);
        }
      }
    },
    'click #stop_button': function(){
      if(Status.find({name: Session.get('view')}).fetch()[0].by === Meteor.user().username)
      Meteor.call('stop_clicked');
      Meteor.call('set_status_idle', Session.get('view'));
      $('#start_button').attr("disabled", false);
    }  ,
    'click #car1': function(){
      Session.set('view', 'carnumber1');
    },
    'click #car2': function(){
      Session.set('view', 'carnumber2');
    }
  });

  Template.live1.helpers({
    user: function(){
      if(Meteor.user())
      return Meteor.user().username;
    },
    live_points: function(){
      if(Meteor.user())
      return Meteor.user().points;
    },
  });

  Template.container.onRendered(function(){
    this.subscribe("cars");
    if(window.location.pathname === '/live'){
      c = Meteor.setTimeout(u, 1000);
    } else {
      c = Meteor.setTimeout(v, 1000);
    }

  });

  Template.status_bar.onCreated(function () {
    this.subscribe("cars");
  });

  Template.status_bar.helpers({
      status: function(){
        var current_car = Session.get('view');
        var current_status = Status.findOne({name: current_car})._is;
        if(current_status === 'idle'){
          return Session.get('view') + ' is available';
        } else {
          return 'User --> ' + Status.findOne({name: current_car}).by + ' is controlling ' + current_car;
      }
    }, 
    time_left: function(){
      //return '  -- should time_left be global?? --'
    }
  });




  window.onbeforeunload = function() {
    if(Meteor.user())
    Meteor.call('update_database_on_destroy', Meteor.user().points, Meteor.userId());
    return null;
  };

}




if (Meteor.isServer) {

  Meteor.startup(function () {
    if (Status.find().count() === 0) {
      var names = ['carnumber1', 'carnumber2'];
      _.each(names, function (name) {
        Status.insert({
          name: name,
          _is: "idle",
          by: ""
        });
      });
    }
  });

  var controller;
  var user_id;
  var points;
  var click_check = false;
  var updater = function(){
    var current_points = points;
    var points_minus_one = current_points - 1;
    if(current_points >= 1){
      Meteor.users.update(user_id, {$set: {points: current_points}});
      points -= 1;
    }
  };

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
    },
    live_updater: function(u, p){
      user_id = u;
      points = p;
      if(click_check === false){
        controller = Meteor.setInterval(updater, 1000);
        click_check = true;
      }
    },
    stop_clicked: function(){
      Meteor.clearInterval(controller);
      click_check = false;
    },
    car_current_status: function(c){
      var r = Status.findOne({name: c})._is;
      return r.toString();
    },
    set_status_busy: function(c, u){
      var id_ = Status.findOne({name: c})._id;
      Status.update(id_, {$set: {_is: 'busy'}});
      Status.update(id_, {$set: {by: u}});
    },
    set_status_idle: function(c){
      var id_ = Status.findOne({name: c})._id;
      Status.update(id_, {$set: {_is: 'idle'}});
      Status.update(id_, {$set: {by: ""}});
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

  Meteor.publish('cars', function(){
    return Status.find();
  })

}


Status = new Mongo.Collection("car_status");


