export const AdminLogin = Vue.component('admin_login', {
    template:
    `
    <div class="container ">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="vertical-center"><h2>Admin Login</h2></div>
                <div class="vertical-center">
                    <form id="admin_login_form" >
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
                        <button type="submit" v-on:click="login()" class="btn btn-primary">login</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        login: async function(){
            const form = document.getElementById("admin_login_form");
            const email = form.elements["email"].value;
            const password = form.elements["password"].value;
            if (email==="" || password===""){
                alert("Some of the fields are empty!")
                return 0
            }
            else {
                const is_admin = await fetch("http://127.0.0.1:8081/api/is_admin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({"email": email})
                })
                .then((response) => {
                    if (response.ok){
                        return response.json()
                    }
                    else {
                        throw new Error('Error:' + response.status)
                    }
                })
                .catch((e) => {alert("There is some server issue!"); return 0})

                if(is_admin.success === 1){
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
                        this.$router.push('/admin_dashboard');
                    }
                }
                else if(is_admin.success === -1) {
                    alert("You don't have admin access!")
                }
            }
        }
    }
})