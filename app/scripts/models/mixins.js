/*global DLow*/

Dlow.Models = Dlow.Models || {};

(function () {
  'use strict';

  Dlow.Models.Mixins = {

    CONTENT_ROOT: "data/",

    /** 
     * @description Given a path to a node in our content data structure, parse
     * the path, and then iterate to the specified node, returning it to the
     * caller.
     * TODO: How should we handle the error case where there is no node in the
     * our content data structure for the specified path?  Throw an exception..?
     */
    getNodeFromPath: function(path) {
      var node = Dlow.Content;

      if (path) {
        var parts = path.split("/");
        
        _.each(parts, function(part) {
          node = node[part];
        });
      }

      return node;
    },

    /**
     * @description Given the path to our parent return a new content model if
     * a parent exists.
     */
    getParent: function() {

      // Remove last element from path to get parent path
      var path = this.get("path").split("/");
      path.pop();

      var parentPath = path.join("/");
      var parentContent = null;

      if (parentPath) {
        parentContent = new Dlow.Models.Content({path: parentPath, populateChildren: false});
      }
     
      return parentContent;
    }

  };

})();