/*global Dlow, Backbone*/

Dlow.Models = Dlow.Models || {};

(function () {
    'use strict';

    Dlow.Models.Content = Backbone.Model.extend({

        url: '',

        /**
         * @description Given a node in the content data structure populate
         * either the subcontents or posts depending on whether the node's 
         * children are leaf nodes or not.
         * TBD: Should we pass a path, rather than a node in the content data
         * structure to the constructor?  That would make the calculation of
         * the path of our subcontents much, much easier...
         */
        initialize: function() {
            this.set("subcontents", []);
            this.set("posts", []);

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
            var content = this.get("content");
            var subcontents = this.get("subcontents");
            var keys = _.keys(content);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
            
                subcontents.push({
                    name: key,
                    path: null,
                    randomPost: this.findRandomPost(key, content[key])
                });
            }

            this.set("subcontents", subcontents);
        },

        /** 
         * TODO: Can this method be shared or is the home model really just a 
         * content model used on the home page?  Now that I think about it, the
         * later makes sense!
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
