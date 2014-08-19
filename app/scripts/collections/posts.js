/*global Dlow, Backbone*/

Dlow.Collections = Dlow.Collections || {};

(function () {
    'use strict';

    Dlow.Collections.Posts = Backbone.Collection.extend({

        model: Dlow.Models.Posts

    });

})();
