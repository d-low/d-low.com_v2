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
    }

  };

})();