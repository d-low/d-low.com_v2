/*global Dlow, Backbone*/

Dlow.Collections = Dlow.Collections || {};

(function () {
    'use strict';

    Dlow.Collections.Images = Backbone.Collection.extend({

        model: Dlow.Models.Image,

        /**
         * @description Initialize a collection of models given the following
         * options:
         * @param options.path 
         * @param options.filenames
         * @param options.thumbs
         */
        initialize: function(models, options) {
          _.each(options.filenames, function(filename) {
            this.add(new this.model({
              path: options.path, 
              filename: filename,
              thumbs: options.thumbs
            }));
          }, this);
        }

    });

})();
