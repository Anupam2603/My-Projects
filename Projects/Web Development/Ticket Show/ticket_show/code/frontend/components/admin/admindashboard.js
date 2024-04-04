import {Theatres} from "./theatre.js"
import { TheatreCreateForm } from "./theatrecreateform.js"

export const AdminDashboard = Vue.component("admin_dashboard", {
    data: function(){
        return {
            user: sessionStorage.getItem("email")
        }
    },
    template:
    `
    <div class="container">
        <div class="row">
            <div class="col-1">
                <h4>{{user}}'s Dashboard</h4>
            </div>
            <div class="col-10">
                <div></div>
            </div>
            <div class="col-1">
                <button type="button" class="btn btn-link" v-on:click="logout()">Logout</button>
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
        Theatres,
        TheatreCreateForm
    },
    methods:  {
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