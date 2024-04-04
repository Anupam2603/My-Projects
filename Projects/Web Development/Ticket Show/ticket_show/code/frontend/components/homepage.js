export const HomePage = Vue.component('homepage', {
    template:
    `
    <div class="container ">
        <div class="row">
            <div class="col-2">
            </div>
            <div class="col-8 text-center">
                <div class="vertical-center">
                    <h1>Welcome to Ticket Show!</h1>
                </div>
                <div class="vertical-center">
                    <h4><router-link to="/admin_login">Admin Login</router-link> | <router-link to="/user_login">User Login</router-link></h4>
                </div>
            </div>
            <div class="col-2">
            </div>
        </div>
    </div>
    `
})