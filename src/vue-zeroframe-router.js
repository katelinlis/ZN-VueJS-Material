//export default MyPlugin;
var Router = require("./router.js");

const VueRouteLink = {
    props: ['to'],
    template: '<a v-bind:href="getHref" v-on:click.prevent="goto" v-bind:class="{ \'is-active\': active }"><slot></slot></a>',
    methods: {
        goto: function() {
            Router.navigate(this.to);
        }
    },
    computed: {
        active: function() {
            if (Router.currentRoute === this.to) {
                return true;
            }
            return false;
        },
        getHref: function() { // Middle Click - open in new tab
            return "./?/" + this.to;
        }
    }
};

const VueZeroFrameRouter = {
    routes: null,
    install(Vue) {
        Vue.component('route-link', VueRouteLink);
    }
};

function VueZeroFrameRouter_Init(Router, vueInstance, routes) {
    VueZeroFrameRouter.routes = routes;
    for (var i = 0; i < routes.length; i++) {
        Router.add(routes[i].route, !routes[i].component.init ? function() {} : routes[i].component.init, {
            before: !routes[i].component.before ? function() { return true; } : routes[i].component.before,
            after: !routes[i].component.after ? function() {} : routes[i].component.after,
            leave: !routes[i].component.leave ? function() {} : routes[i].component.leave
        }, routes[i].component);
    }
    Router.vueInstance = vueInstance;
    Router.setView = function(i, object) {
        this.vueInstance.currentView = object;
    }
    Router.init();
}

module.exports = {
    VueZeroFrameRouter: VueZeroFrameRouter,
    VueZeroFrameRouter_Init: VueZeroFrameRouter_Init
}