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
        var model = new Dlow.Models.Content({path: path});

        if (model.isPost()) {
          model = new Dlow.Models.Post(model.get("content"));
          console.log("TODO: Render a post view!");
        }
        else {
          this.view = new Dlow.Views.Content({
            el: $("#content"),
            model: model
          });
        }
      }

    });

})();
