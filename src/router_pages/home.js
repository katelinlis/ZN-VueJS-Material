var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Home = {
    beforeMount: function() {
        // this.$emit('getUserInfo');
        if (this.userInfo == null || this.userInfo.cert_user_id == null) {
            Router.navigate('');
            console.log("Redirected to LP", this.userInfo);
        } else {
            console.log("Staying on Home", Router.currentParams);
        }

        console.log("Loaded App (home)", this.userInfo);
    },
    props: {
        userInfo: Object,
        siteInfo: Object,
        theme: String
    },
    data: function() {
        return {
            theme: this.theme
        }
    },
    computed: {
        isLoggedIn: function() {
            if (this.userInfo == null) return false;
            return this.userInfo.cert_user_id != null;
        }
    },
    watch: {
        theme: function() {
            console.log("Watching theme", this.theme);

            return this.theme;
        }
    },
    methods: {
        toggleMenuVisible: function() {
            this.$emit('toggleMenuVisible');
        },
        logIn: function() {
            this.$emit('logIn');
        },
        logOut: function() {
            this.$emit('logOut');
        },
        goto: function(to) {
            Router.navigate(to);
        }
    },
    template: `
    <div>
        <div v-if="isLoggedIn">
            <a href="#" v-on:click.prevent="logOut">Log out</a>
            
            <p v-for="(i) in 50">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        </div>
        <div v-else>
            <md-empty-state
                md-icon="help_outline"
                md-label="You aren't logged in yet"
                md-description="Please log in to see more things!">
                <md-button class="md-accent md-raised" v-on:click.prevent="logIn">Log in</md-button>
            </md-empty-state>
        </div>
        </div>
    </div>
    `
};

module.exports = Home;