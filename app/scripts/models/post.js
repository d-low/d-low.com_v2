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
            var node = Dlow.Models.Post.getNodeFromPath(this.get("path"));

            this.set("html", data);
            this.set("name", node.name);
            this.set("title", 
                node.name
                    .replace(/^\d+-/, '')
                    .replace(/_/g, ' ')
                    .replace(/-/g, ', ')
                    .replace(/(\s\d\d\d\d)$/, ',$1')
            );
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

    // We extend the object itself, not the prototype, because we need the 
    // getNodeFromPath() method available in the isPost() class method, not on
    // instance methods.
    // NOTE: If this changes, and we need this method on an instance, then we
    // can extend the prototype too!  
    _.extend(Dlow.Models.Post, Dlow.Models.Mixins);

    /**
     * @description Static, or class, method used to check if a node or path to
     * a node in our content structure is a post.
     * @param node Optional parameter, a node in our content data structure.
     * @param path If node not specified, find the node corresponding to the 
     * specified path.
     */
    Dlow.Models.Post.isPost = function(node, path) { 
        node = node || Dlow.Models.Post.getNodeFromPath(path);

        var isPost = false;

        if (_.isObject(node) && typeof(node["path"]) !== "undefined") {
            isPost = true;
        }

        return isPost;
    };

})();
