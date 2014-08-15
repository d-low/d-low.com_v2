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
            this.set("url", "/#content/" + this.get("path"));

            // Parse the title creating a hash of parts to URLs so that we can
            // display a breadcrumb letting the user know where they are and 
            // making each part an anchor for easier navigation.
    
            var parts = this.get("path").split("/");
            var title = [];
            var titleNav = [];

            parts.forEach(function(part, i) {
                var name = part.replace(/^\d\d-/, "").replace(/[-_]/g, " ");
                
                // Remove the name of the previous part of the title from the
                // current part of the title, i.e. chnage "Colorado / Colorado 
                // 2012" to "Colorado / 2012".

                if (typeof title[i -1] !== "undefined") {
                    name = name.replace(title[i - 1], "");
                }

                title.push(name);

                // Now create the name/url pairs that will be used on the desktop
                // site for a breadcrumb.

                var url = "";

                if (i == 0 && i != parts.length - 1) {
                    url = "/#content/" + parts[0];
                }
                else if (i != parts.length - 1) {
                    url = "/#content/" + parts.slice(0, i + 1).join("/");
                }

                titleNav.push({
                    name: name,
                    url: url
                });
            });

            this.set("title", title.join(" / "));
            this.set("titleNav", titleNav);

            // Find our content in the content data structure based on the path 
            // passed to us.  When called for the top level node our path will
            // not be set.

            var path = this.get("path");
            var node = this.getNodeFromPath(path);

            this.set("node", node);

            if (this.areChildrenPosts()) {
                this.setPosts();
            }
            else if (!this.isPost()) {
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
            var node = this.get("node");
            var keys = _.keys(node);
            var childrenArePosts = true;

            for (var i = 0; i < keys.length; i++) { 
                var key = keys[i];

                if (!Dlow.Models.Post.isPost(node[key])) {
                    childrenArePosts = false;
                    break;
                }
            }

            return childrenArePosts;
        },

        isPost: function() { 
            return Dlow.Models.Post.isPost(this.get("node"));
        },

        setPosts: function() { 
            var node = this.get("node");
            var keys = _.keys(node);
            var posts = [];

            for (var i = 0; i < keys.length; i++) { 
                var key = keys[i];
                posts.push(new Dlow.Models.Post(node[key]));
            }

            this.set("posts", posts);
        },

        /** 
         * When our children are not posts, then find a random post, save it, 
         * the path to the next level, and the name of the next level to our 
         * subcontents data member which will be an array of: { name, path, 
         * randomPost } obects.
         * TODO: Instead of a custom data structure, should we instead have 
         * a Contents collection instance?  If we did that then we could do 
         * away with findRandomPost() and just use getRandomPost(), or rather
         * rename findRandomPost() to getRandomPost() since the functionality
         * in findRandomPost() doesn't dependon having posts or subcontents 
         * populated.  If we did this then we'd need to pass a parameter to the 
         * Content constructor as a flag to avoid calling setPosts() or 
         * setSubContents().
         */
        setSubcontents: function() { 
            var path = this.get("path");
            var node = this.get("node");
            var subcontents = this.get("subcontents");
            var keys = _.keys(node);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
            
                subcontents.push({
                    name: key,
                    path: path + "/" + key,
                    title: key.replace(/^\d+-/, '').replace(/-/g, ' '),
                    randomPost: this.findRandomPost(key, node[key])
                });
            }

            this.set("subcontents", subcontents);
        },

        /** 
         * @description Recurse through our nodes, selecting one at random at 
         * each level to follow, until we find a post that will be used as our 
         * random post for the current subcontent item.
         * REVIEW: It is confusing to have a method titled findRandomPost() and
         * a getRandomPost().  Shouldn't we just find a random post from either 
         * our subcontents or posts, and set it as a member on the model?  Why
         * do we have both methods?
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
        },

        /** 
         * @description Return a random post from either our subcontents or our
         * posts, depending on the type of children this content node has.
         * TODO: Remove this method instead and use findRandomPost() to set a 
         * randomPost attribute on the model?
         */
        getRandomPost: function() {
            var randomPost = null;
            var randomPostIndex;
            var posts = this.get("posts");
            var subcontents = this.get("subcontents");

            if (posts && posts.length) {
                randomPostIndex = _.random(0, posts.length - 1);
                randomPost = posts[randomPostIndex];
            }
            else if (subcontents && subcontents.length) {
                randomPostIndex = _.random(0, subcontents.length - 1);
                randomPost = subcontents[randomPostIndex].randomPost;
            }

            return randomPost;
        },

    });

    _.extend(Dlow.Models.Content.prototype, Dlow.Models.Mixins);

})();
