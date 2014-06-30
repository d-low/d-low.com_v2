/*global DLow, Backbone*/

Dlow.Models = Dlow.Models || {};

(function () {
    'use strict';

    Dlow.Models.Post = Backbone.Model.extend({

        url: '',

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
            // this.set("imags", ...);
            // this.set("thumbnails", ...);
            // this.trigger("postready");
        }
    });

})();
