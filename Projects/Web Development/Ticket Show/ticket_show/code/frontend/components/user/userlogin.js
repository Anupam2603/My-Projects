export const UserLogin = Vue.component('user_login', {
    template:
    `
    <div class="container ">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="vertical-center"><h2>User Login</h2></div>
                <div class="vertical-center">
                    <form id="user_login_form">
                        <div class="form-group">
                            <h3>
                                <label for="email">Email:</label>
                                <input type="email" class="form-control" id="email" placeholder="Enter email"/>
                            </h3>
                        </div>
                        <div class="form-group">
                            <h3>
                                <label for="password">Password:</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter password"/>
                            </h3>
                        </div>
                        <button type="submit" class="btn btn-primary" v-on:click="login()">login</button>
                        <p>or<br/>
                            <router-link to="/register">Register</router-link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        login: async function(){
            const form = document.getElementById("user_login_form");
            const email = form.elements["email"].value;
            const password = form.elements["password"].value;
            if (email==="" || password===""){
                alert("Some of the fields are empty!")
                return 0
            }
            else {
                const data = {"email": email, "password": password}
                const auth_token_obj = await fetch("http://127.0.0.1:8081/login?include_auth_token", {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                                })
                                .then((response) => {
                                if (response.ok){
                                    return response.json()
                                }
                                else {
                                    throw new Error ('Error: ' + response.status)
                                }
                                })
                                .catch((e) => {alert("Please provide valid email or password"); return 0})
                console.log(auth_token_obj)
                if (auth_token_obj === 0) {
                    return 0
                }
                else {
                    const auth_token = auth_token_obj.response.user.authentication_token
                    sessionStorage.setItem("token", auth_token)
                    sessionStorage.setItem("email", email)
                    this.$router.push('/user_dashboard');
                }
                
            }
            
        }
    }
})