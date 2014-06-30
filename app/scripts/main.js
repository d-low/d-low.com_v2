/*global Dlow, $*/


window.Dlow = {
    Models: {},
    DATA_PATH: "/data/",
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        console.log('Hello from Backbone!');
    }
};

$(document).ready(function () {
    'use strict';
    Dlow.init();
});
