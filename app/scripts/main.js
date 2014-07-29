/*global Dlow, $*/


window.Dlow = {
    Models: {},
    DATA_PATH: "/data/",
    Collections: {},
    Views: {},
    Routers: {},
    router: null,
    init: function () {
        'use strict';
        console.log('Hello from Backbone!');
        this.router = new Dlow.Routers.Content();
    }
};

$(document).ready(function () {
    'use strict';
    Dlow.init();
});
