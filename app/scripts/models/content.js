/*global Dlow, Backbone*/

Dlow.Models = Dlow.Models || {};

(function () {
    'use strict';

    Dlow.Models.Content = Backbone.Model.extend({

        url: '',

        /**
         * @description Given a path to a node in the content data structure 
         * populate either the subcontents or posts depending on whether the 
         * node's children are leaf nodes or not.
         */
        initialize: function() {
            this.set("subcontents", []);
            this.set("posts", []);

            // Find our content in the content data structure based on the path 
            // passed to us.  When called for the top level node our path will
            // not be set.

            var path = this.get("path");
            var content = Dlow.Content;

            if (path) {
                var parts = path.split("/");
                
                _.each(parts, function(part) {
                    content = content[part];
                });
            }

            this.set("content", content);

            if (this.areChildrenPosts()) {
                this.setPosts();
            }
            else {
                this.setSubcontents();
            }
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },

        areChildrenPosts: function() { 
            var content = this.get("content");
            var keys = _.keys(content);
            var childrenArePosts = true;

            for (var i = 0; i < keys.length; i++) { 
                var key = keys[i];

                if (!Dlow.Models.Post.isPost(content[key])) {
                    childrenArePosts = false;
                    break;
                }
            }

            return childrenArePosts;
        },

        setPosts: function() { 
            var content = this.get("content");
            var keys = _.keys(content);
            var posts = [];

            for (var i = 0; i < keys.length; i++) { 
                var key = keys[i];
                posts.push(new Dlow.Models.Post(content[key]));
            }

            this.set("posts", posts);
        },

        /** 
         * When our children are not posts, then find a random post, save it, 
         * the path to the next level, and the name of the next level to our 
         * subcontents data member which will be an array of: { name, path, 
         * randomPost } obects.
         */
        setSubcontents: function() { 
            var path = this.get("path");
            var content = this.get("content");
            var subcontents = this.get("subcontents");
            var keys = _.keys(content);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
            
                subcontents.push({
                    name: key,
                    path: path + "/" + key,
                    randomPost: this.findRandomPost(key, content[key])
                });
            }

            this.set("subcontents", subcontents);
        },

        /** 
         * Recurse through our nodes, selecting one at random at each level to
         * follow, until we find a post that will be used as our random post
         * for the current subcontent item.
         */
        findRandomPost: function(key, subContent) {
            if (Dlow.Models.Post.isPost(subContent)) {
                return new Dlow.Models.Post(subContent);
            }
            else {
                var keys = _.keys(subContent);
                var index = _.random(0, keys.length - 1);
                return this.findRandomPost(key, subContent[keys[index]]);
            }
        }
    });

})();
