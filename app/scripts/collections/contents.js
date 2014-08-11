/*global Dlow, Backbone*/

Dlow.Collections = Dlow.Collections || {};

(function () {
    'use strict';

    Dlow.Collections.Contents = Backbone.Collection.extend({

        model: Dlow.Models.Content

    });

})();
