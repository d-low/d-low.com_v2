/*global Dlow, Backbone*/

Dlow.Routers = Dlow.Routers || {};

(function () {
  'use strict';

  Dlow.Routers.Content = Backbone.Router.extend({

    initialize: function (options) {
      console.log("Dlow.Routers.Content: started")
      Backbone.history.start({pushState: false})
    },

    routes: {
      "content/*path": "content",
      "*path":  "home"
    },

    home: function() {
      if (this.view) {
        this.view.close();
      }

      this.view = new Dlow.Views.Home({
        el: $("#content"),
        model: new Dlow.Models.Home()
      });

      $("body").removeClass("content").addClass("home");
    },

    content: function(path) {
      if (this.view) {
        this.view.close();
      }
      
      if (Dlow.Models.Post.isPost(null, path)) {
        this.view = new Dlow.Views.Post({
          el: $("#content"),
          model: {
            post: new Dlow.Models.Post({path: path}),
            home: new Dlow.Models.Home()
          }
        });
      }
      else {
        this.view = new Dlow.Views.Content({
          el: $("#content"),
          model: {
            content: new Dlow.Models.Content({path: path}),
            home: new Dlow.Models.Home()
          }
        });
      }

      $("body").removeClass("home").addClass("content");
    }

  });

})();
