/*global Dlow, Backbone*/

Dlow.Models = Dlow.Models || {};

(function () {
    'use strict';

    Dlow.Models.Home = Backbone.Model.extend({

        url: '',

        /**
         * @description Reset our random posts and then find new ones for each
         * of the top level fields in our content.
         */
        initialize: function() {
            this.set("randomPosts", {});

            // For each field in the top level content walk the tree and find a
            // leaf node, and instantiate a post model for the leaf node found.

            for (var key in Dlow.Content) {
                this.findRandomPost(key, Dlow.Content[key]);
            }
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },

        /**
         * @description Recurse through the subcontent until we find a post by
         * selecting a random key from the list of keys in the current content
         * node and stopping when the current node has a path property.
         */
        findRandomPost: function(key, subContent) {
            if (Dlow.Models.Post.isPost(subContent)) {
                var randomPosts = this.get("randomPosts");
                randomPosts[key] = new Dlow.Models.Post(subContent);
            }
            else {
                var keys = _.keys(subContent);
                var index = _.random(0, keys.length - 1);
                return this.findRandomPost(key, subContent[keys[index]]);
            }

        },
    });

})();
