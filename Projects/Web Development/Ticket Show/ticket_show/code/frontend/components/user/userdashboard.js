import {Theatres_} from "./theatre.js"

export const UserDashboard = Vue.component("user_dashboard", {
    data: function(){
        return {
            user: sessionStorage.getItem("email"),
            location: ""
        }
    },
    template:
    `
    <div class="container">
        <div class="row">
            <div class="col-2">
                <h4>{{user}}'s Dashboard</h4>
            </div>
            <div class="col-8">
            </div>
            <div class="col-2">
            <router-link to="/user_dashboard">Home</router-link> | <router-link to="/user_dashboard/profile">Profile</router-link> | <br/><button type="button" class="btn btn-link" v-on:click="logout()">Logout</button>
            </div>
        </div>
        <div class="row">
            <div class="col-1">
            </div>
            <div class="col-10">
                <router-view></router-view>
            </div>
            <div class="col-1">
            </div>
        </div>
    </div>
    `,
    components: {
        Theatres_
    },
    methods: {
        logout: function(){
            const success = fetch("http://127.0.0.1:8081/logout", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': sessionStorage.getItem("token"),
                    'email': sessionStorage.getItem("email")
                }
            })
            sessionStorage.clear()
            this.$router.push("/")
        }
    }
})