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
        var content = new Dlow.Models.Content({path: path});
        console.log("Requested: /content/" + path + ", dum}ping content model:");
        console.dir(content);
      }
    });

})();
