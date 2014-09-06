/*global Dlow, Backbone*/

Dlow.Models = Dlow.Models || {};

(function () {
  'use strict';

  Dlow.Models.Image = Backbone.Model.extend({

    url: '',

    /**
     * @description Create a new image model setting the file name, thumbnail
     * file name.
     * @param path
     * @param filename Image file name
     * @param thumbs Boolean value, if true, thumbnail is available at 
     * path/thumbnails/<filename>
     * TODO: Rename fields.  Having a fullpath and thumbnail field isn't consistent!
     */
    initialize: function() { 
      this.set(
        "fullpath", 
        Dlow.Models.Mixins.CONTENT_ROOT + this.get("path") + "/" + this.get("filename")
      );

      if (this.get("thumbs")) {
        this.set(
          "thumbnail", 
          Dlow.Models.Mixins.CONTENT_ROOT + this.get("path") + "/thumbnails/" + this.get("filename")
        );
      }

      var caption = this.get("filename")
        .replace(/^\d\d\d\d-\d\d-\d\d-\d\d-/, '')
        .replace(/\.\w+$/, '')
        .replace(/([a-z])([A-Z])/g, '$1 $2');

      this.set("caption", caption);

      this.trigger("imageready");
    },

    defaults: {
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
