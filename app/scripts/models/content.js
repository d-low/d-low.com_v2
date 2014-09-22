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
     * @param options.populateChildren When set to false, don't query child
     * nodes to find posts or subcontents.
     */
    initialize: function() {
      this.set("subcontents", null);
      this.set("posts", null);
      this.set("url", "/#content/" + this.get("path"));
      this.setTitle();

      // Find our content in the content data structure based on the path 
      // passed to us.  When called for the top level node our path will
      // not be set.

      var path = this.get("path");
      var node = this.getNodeFromPath(path);

      this.set("node", node);

      // We may be instantiated as a subcontent item in which case we do
      // not want to query our children to get posts or subcontents.

      if (this.get("populateChildren") === false) {
        this.trigger("ready");
        return;
      }

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

    /**
     * @description Return true to the caller if we're ready.  We're ready
     * when we are not populating children, or when we're populating 
     * children, when they're all ready.
     */
    isReady: function() {
      var fIsCollectionReady = function(collection) {
        var isCollectionReady = false;

        for (var i = 0; i < collection.length; i++) {
          if (!collection.at(i).isReady()) {
            break;
          }
          else if (i == collection.length - 1) {
            isCollectionReady = true;
          }
        }

        return isCollectionReady;
      };

      if (this.get("populateChildren") === false) {
        return true;
      }
      else if (this.areChildrenPosts()) {
        return fIsCollectionReady(this.get("posts"));
      }
      else if (!this.isPost()) {
        return fIsCollectionReady(this.get("subcontents"));
      }
    },

    /**
     * @description Populate collection of posts when child nodes are 
     * posts.
     */
    setPosts: function() { 
      var node = this.get("node");
      var keys = _.keys(node);
      var posts = new Dlow.Collections.Posts();

      for (var i = 0; i < keys.length; i++) { 
        var key = keys[i];
        var post = new Dlow.Models.Post(node[key]);
        
        post.on("ready", function() { 
          if (this.isReady()) {
            this.trigger("ready");
          }
        }, this);

        posts.push(post);
      }

      this.set("posts", posts);
    },

    /** 
     * @description When our children are not posts populate a collection 
     * of content instances ensuring that they do NOT populate their child
     * nodes.
     */
    setSubcontents: function() { 
      var node = this.get("node");
      var subcontents = new Dlow.Collections.Contents();
      var keys = _.keys(node);

      _.each(keys, function(key) {
        var subcontent = new Dlow.Models.Content({ 
          path: this.get("path") + "/" + key,
          populateChildren: false
        });

        subcontent.on("ready", function() { 
          if (this.isReady()) {
            this.trigger("ready");
          }
        }, this);

        subcontents.push(subcontent);
      }, this);

      this.set("subcontents", subcontents);
      this.trigger("ready");
    },

    /**
     * @description Set the the title of the content removing any occurence of
     * the parent path name and then removing leading digits and replacing 
     * dashes and underscores with white space.  
     * NOTE: We use this method, rather than the commented out one below, 
     * because we're not using any breadcrumb navigation.
     */
    setTitle: function() {
      var parts = this.get("path").split("/");
      var title = parts[parts.length - 1];

      title = title.replace(/^\d\d-/, "").replace(/[-_]/g, " ");

      if (typeof parts[parts.length - 2] !== "undefined") {
        var parent = parts[parts.length - 2];
        parent = parent.replace(/^\d\d-/, "").replace(/[-_]/g, " ");
        title = title.replace(new RegExp(parent, "i"), "");
      }

      this.set("title", title);
    },

    /** 
     * @description Parse the title creating a hash of parts to URLs so that we
     * can display a breadcrumb letting the user know where they are and making
     * each part an anchor for easier navigation.
     */
    /*
    setTitle: function() { 
      var parts = this.get("path").split("/");
      var title = [];
      var titleNav = [];

      parts.forEach(function(part, i) {
        var name = part.replace(/^\d\d-/, "").replace(/[-_]/g, " ");
        
        // Remove the name of the previous part of the title from the
        // current part of the title, i.e. chnage "Colorado / Colorado 
        // 2012" to "Colorado / 2012".

        if (typeof title[i - 1] !== "undefined") {
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

      // REVIEW: Why do we only save the title nav if there is more than
      // one part of the path?  This logic seems fragile. 
      this.set("titleNav", titleNav.length > 1 ? titleNav : []);
    },
    */

    /** 
     * @description Recurse through our nodes, selecting one at random at 
     * each level to follow, until we find a post that will be used as our 
     * random post for the current subcontent item.
     * @param nodes
     */
    getRandomPost: function(node) {
      
      // When first called on a content model instance we won't have a
      // node so we use the node of our instance.

      if (!node) {
        node = this.get("node");
      }

      if (Dlow.Models.Post.isPost(node)) {
        
        // If the node is a post then we've hit our recursive base case
        // so we return a new post instance for the selected node.

        return new Dlow.Models.Post({path: node["path"], noIndex: true});
      }
      else {

        // If the node is not a post then get an array of it's child 
        // nodes, select one at random, and continue recursing until we
        // end at a node that is a post.

        var nodes = _.values(node);
        var index = _.random(0, nodes.length - 1);
        return this.getRandomPost(nodes[index]);
      }
    }
  });

  _.extend(Dlow.Models.Content.prototype, Dlow.Models.Mixins);

})();
