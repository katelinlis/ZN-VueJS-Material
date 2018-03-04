var ZeroFrame = require("./ZeroFrame.js");

var Vue = require("vue/dist/vue.min.js");

var Router = require("./router.js");

var VueZeroFrameRouter = require("./vue-zeroframe-router.js");

var VueMaterial = require('vue-material');

openNewTab = function openNewTab(url) {
    page.cmd("wrapperOpenWindow", [url, "_blank", ""]);
    return false;
};



Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);
Vue.use(VueMaterial.default);

app = new Vue({
    el: '#app',
    template: `
        <div class="page-container">
            <md-app md-waterfall md-mode="fixed" v-bind:mdTheme="theme">
                <md-app-toolbar class="md-primary">
                    <div class="md-toolbar-row">
                    <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                        <md-icon>menu</md-icon>
                    </md-button>

                    <span class="md-title">VueJS Material Test</span>
                    </div>
                </md-app-toolbar>

                <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
                    <md-toolbar v-if="isLoggedIn" class="md-transparent" md-elevation="0">
                        <md-field md-inline md-clearable>
                            <label>Search</label>
                            <md-input v-model="search"></md-input>
                        </md-field>
                    </md-toolbar>
                    <md-toolbar v-else class="md-transparent" md-elevation="0">
                        Please log in!
                    </md-toolbar>
                    
                    <md-divider></md-divider>
                    <div style="height: calc(100% - 64px - 1px);">
                        <md-list v-if="isLoggedIn" class="md-scrollbar" style="height: calc(100% - 64px - 24px * 2 - 1px * 2); overflow: auto;">
                            <md-list-item>
                                <md-icon>public</md-icon>
                                <span class="md-list-item-text">Inbox</span>
                            </md-list-item>
                            <md-list-item v-for="(i) in 15">
                                <md-icon>group</md-icon>
                                <span class="md-list-item-text">Inbox</span>
                            </md-list-item>
                            <md-list-item v-for="(i) in 15">
                                <md-icon>person</md-icon>
                                <span class="md-list-item-text">Inbox</span>
                            </md-list-item>
                        </md-list>
                        <md-list v-else class="md-scrollbar" style="height: calc(100% - 64px - 24px * 2 - 1px * 2); overflow: auto;">
                            <md-list-item v-on:click.prevent="logIn">
                                <md-icon>person_outline</md-icon> 
                                <span class="md-list-item-text">Log in</span>
                            </md-list-item>
                        </md-list>
                        
                        <md-divider></md-divider>
                        <md-list>
                            <md-list-item v-on:click.prevent="toggleTheme">
                                <md-icon>invert_colors</md-icon>
                                <span class="md-list-item-text">Invert theme</span>
                            </md-list-item>
                            <md-list-item>
                                <md-icon>settings</md-icon>
                                <span class="md-list-item-text">Settings</span>
                            </md-list-item>
                        </md-list>
                    </div>
                </md-app-drawer>

                <md-app-content>
                    <div v-html="out"></div>
                    <component ref="view" v-bind:is="currentView"
                    v-on:toggleMenuVisible="toggleMenuVisible" v-on:logIn="logIn" v-on:logOut="logOut"
                    v-bind:userInfo="userInfo" v-bind:siteInfo="siteInfo"
                    v-bind:theme="theme"
                    ></component>
                </md-app-content>
            </md-app>
        </div>
    `,
    data: {
        out: null,
        currentView: null,
        serverInfo: null,
        siteInfo: null,
        userInfo: null,
        menuVisible: false,
        theme: "default",
        search: ""
    },
    computed: {
        isLoggedIn: function() {
            if (this.userInfo == null) return false;
            return this.userInfo.cert_user_id != null;
        }
    },
    watch: {
        theme: function() {
            this.$material.theming.theme = this.theme;
        }
    },
    methods: {
        toggleMenuVisible: function(to) {
            if (to && typeof to === "boolean")
                this.menuVisible = to;
            else
                this.menuVisible = !this.menuVisible;
        },
        toggleTheme: function(to) {
            if (to && typeof to === "string")
                this.theme = to;
            else
                this.theme === "default" ? this.theme = "default-dark" : this.theme = "default";
        },
        logIn: function() {
            if (this.siteInfo == null) {
                return;
            }

            var dis = this;

            page.selectUser(function() {
                console.log("User selected; Logging in..");
                page.verifyUserFiles(undefined, function() {
                    console.log("Logged in");

                    dis.getUserInfo();
                    dis.goto('/app');
                });
            });
        },
        logOut: function() {
            var dis = this;

            page.signOut(function() {
                console.log("Logged out");

                dis.getUserInfo();
                dis.goto('');
            });
        },
        goto: function(to) {
            this.menuVisible = false;
            Router.navigate(to);
        },
        getUserInfo: function() {
            if (this.siteInfo == null || this.siteInfo.cert_user_id == null) {
                this.userInfo = null;
                return;
            }

            console.log("Getting user-info", JSON.parse(JSON.stringify(this.siteInfo)));

            var dis = this;

            dis.userInfo = {
                json_id: null,
                public_key: null,
                cert_user_id: dis.siteInfo.cert_user_id,
                auth_address: dis.siteInfo.auth_address
            };

            // page.cmd("dbQuery", [
            //     "SELECT * FROM extra_data LEFT JOIN json USING (json_id) WHERE auth_address = '" + dis.siteInfo.auth_address + "'"
            // ], (res) => {
            //     if (!res || res.length !== 1 || !res[0]) return false;

            //     var user = res[0];

            //     dis.userInfo = {
            //         json_id: user.json_id,
            //         public_key: user.public_key,
            //         cert_user_id: dis.siteInfo.cert_user_id,
            //         auth_address: dis.siteInfo.auth_address
            //     };

            console.log("Got user-info", dis.siteInfo, dis.userInfo);
            // console.log("Got user-info", res, user, dis.siteInfo, dis.userInfo);

            if (Router.currentRoute === "")
                dis.goto('/app');
            // });
        }
    }
});



class Page extends ZeroFrame {
    verifyUserFiles(cb1, cb2, forcesign) {
        typeof cb1 === "function" && cb1();
        typeof cb2 === "function" && cb2();
    }

    selectUser(cb) {
        this.cmd("certSelect", {
            accepted_domains: [
                "zeroid.bit",
                "kaffie.bit",
                "cryptoid.bit"
            ]
        }, () => {
            typeof cb === "function" && cb();
        });
        return false;
    }

    signOut(cb) {
        this.cmd("certSelect", {
            accepted_domains: [""]
        }, () => {
            typeof cb === "function" && cb();
        });
    }

    onRequest(cmd, message) {
        Router.listenForBack(cmd, message);

        if (cmd == "setSiteInfo") {
            this.site_info = message.params;
            app.siteInfo = message.params;
            this.setSiteInfo(message.params);

            app.getUserInfo();
        } else
            this.log("Unknown incoming message:", cmd);
    }

    setSiteInfo(site_info) {
        app.out =
            "Page address: " + site_info.address +
            "<br>- Peers: " + site_info.peers +
            "<br>- Size: " + site_info.settings.size +
            "<br>- Modified: " + (new Date(site_info.content.modified * 1000));
    }

    onOpenWebsocket() {
        this.cmd("siteInfo", [], function(site_info) {
            page.site_info = site_info;
            app.siteInfo = site_info;

            page.verifyUserFiles(undefined, undefined, true);

            app.getUserInfo();

            page.setSiteInfo(site_info);

            page.cmd("serverInfo", [], (res) => {
                app.serverInfo = res;
            });

            var Home = require("./router_pages/home.js");

            VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
                { route: "app", component: Home },
                { route: ":anything", component: Home },
                { route: "", component: Home }
            ]);
        });
    }
}
page = new Page();

function showError(msg, t) {
    var t = typeof t === "number" ? t : 500;
    page.cmd("wrapperNotification", [
        "error", msg, t
    ]);
}

(function() {
    showError(
        "<b>As a warning</b>, <i>this Zite is still in Alpha</i>!",
        10000
    );
})();