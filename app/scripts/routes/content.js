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
        "home": "home",
        "content/*path": "content"
      },

      home: function() {
        // TODO: Render home page
      },

      content: function(path) {
        if (Dlow.Models.Post.isPost(null, path)) {
          this.view = new Dlow.Views.Post({
            el: $("#content"),
            model: new Dlow.Models.Post({path: path})
          });
        }
        else {
          this.view = new Dlow.Views.Content({
            el: $("#content"),
            model: new Dlow.Models.Content({path: path})
          });
        }
      }

    });

})();
