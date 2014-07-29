/*global dLow.comV2, Backbone*/

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
        // TODO: Render content page
        this.model = new Dlow.Models.Content({path: path});;
        console.log("Requested: /content/" + path + ", saved model instance to Dlow.router.model.");
      }
    });

})();
