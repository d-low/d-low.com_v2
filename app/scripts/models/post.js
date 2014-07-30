/*global DLow, Backbone*/

Dlow.Models = Dlow.Models || {};

(function () {
    'use strict';

    Dlow.Models.Post = Backbone.Model.extend({

        url: '',

        /**
         * @description Pass a leaf node of the Dlow.Content structure as the
         * attributes argument to the constructor and here if we have a path,
         * we make a get request to obtain the index.html, and in the success
         * handler, set other attributes that will be used to render a post.
         */
        initialize: function() {
            if (this.get("path")) {
                $.get(
                    Dlow.DATA_PATH + this.get("path") + "/index.html",
                    $.proxy(this.getIndex_success, this)
                );
            }
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },

        getIndex_success: function(data, textStatus, jqXHR) {
            this.set("html", data);
            // TODO:
            // this.set("title", ...);
            // this.set("data", ...);
            // this.set("images", ...);
            // this.set("thumbnails", ...);
            // this.trigger("postready");
        },

        /**
         * @description TODO: Return a random image from our array of images.
         */
        getRandomImage: function() { 
        }
    });

    /**
     * @description Static, or class, method used to check if a node in our
     * content structure is a post.
     */
    Dlow.Models.Post.isPost = function(node) { 
        var isPost = false;

        if (_.isObject(node) && typeof(node["path"]) !== "undefined") {
            isPost = true;
        }

        return isPost;
    };

})();
