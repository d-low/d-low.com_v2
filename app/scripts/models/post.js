/*global DLow, Backbone*/

Dlow.Models = Dlow.Models || {};

(function () {
    'use strict';

    Dlow.Models.Post = Backbone.Model.extend({

        url: '',

        /**
         * @description Pass a leaf node of the Dlow.Content structure as the
         * attributes argument to the constructor, set attributes we can get
         * from the content data structure itself, and then get the index.html
         * triggering a postready event in the sucess handler so that views 
         * which need this HTML can wait until it's been retrieved.
         */
        initialize: function() {
            var node = Dlow.Models.Post.getNodeFromPath(this.get("path"));

            this.set("name", node.name);
            this.set("title", 
                node.name
                    .replace(/^\d+-/, '')
                    .replace(/_/g, ' ')
                    .replace(/-/g, ', ')
                    .replace(/(\s\d\d\d\d)$/, ',$1')
            );
            
            this.set(
                "images", 
                new Dlow.Collections.Images(null, {
                    path: this.get("path"),
                    filenames: node.imgs,
                    thumbs: node.thumbs
                })
            );

            $.get(
                Dlow.DATA_PATH + this.get("path") + "/index.html",
                $.proxy(this.getIndex_success, this)
            );
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
            this.trigger("ready");
        },

        getRandomImage: function() {
            var randomImage = null;
            var images = this.get("images");

            if (images && images.length) {
                var randomImageIndex = _.random(0, images.length - 1);
                randomImage = images.at(randomImageIndex);
            }

            return randomImage;
        },

        /**
         * @description Return URL of random image to caller returning an empty
         * string if one wasn't found to abstract this logic from the caller.
         */
        getRandomImageUrl: function() { 
            var randomImageUrl = "";
            var randomImage = this.getRandomImage();

            if (randomImage) {
                randomImageUrl = randomImage.get("fullpath");
            }

            return randomImageUrl;
        },

        /**
         * @description Method used by caller to check to see whether this post
         * instance is ready or not.  A post instance is ready if we've loaded
         * our HTML successfully.
         */
        isReady: function() { 
            return !!this.get("html");
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
