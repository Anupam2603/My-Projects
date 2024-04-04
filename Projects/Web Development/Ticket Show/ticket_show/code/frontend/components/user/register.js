export const Register = Vue.component('register', {
    template:
    `
    <div class="container ">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="vertical-center"><h2>User Registration</h2></div>
                <div class="vertical-center">
                    <form>
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
                        <button type="submit" v-on:click="register()" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        register: async function(){
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (email==="" || password===""){
                alert("Some of the fields are empty!")
                return 0
            }
            else {
                const data = {"email": email, "password": password}
                const success = await fetch("http://127.0.0.1:8081/api/register", {
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
                            .catch((e) => {console.log(e)})
                console.log(success)
                if (success.success === 1){
                    this.$router.push("/")
                }
                else if(success.success===0){
                    alert("The user already exists! Please use different email id")
                    document.getElementById('email').value = ""
                    document.getElementById('password').value = ""
                    return 0
                }
                else if(success.success===-1){
                    alert("There is some server issue!")
                }
                else if(success.success===-2){
                    alert("Some fields are empty!")
                }
            }
    }
    }
})
