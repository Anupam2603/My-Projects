export const TheatreCreateForm = Vue.component("create_form", {
    template:
    `
    <div class="container ">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="vertical-center"><h2>New Theatre Details:</h2></div>
                <div class="vertical-center">
                    <form id="theatre_create_form" >
                        <div class="form-group">
                            <h3>
                                <label for="name">Name:</label>
                                <input type="text" class="form-control" id="name" placeholder="Enter Theatre Name"/>
                            </h3>
                        </div>
                        <div class="form-group">
                            <h3>
                                <label for="location">Location:</label>
                                <input type="text" class="form-control" id="location" placeholder="Enter Theatre Location"/>
                            </h3>
                        </div>
                        <button type="submit" v-on:click="create()" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        create: async function(){
            const form = document.getElementById('theatre_create_form');
            const name = form.elements['name'].value;
            const location = form.elements['location'].value;
            const data = {"name": name, "location": location}
            const success = await fetch("http://127.0.0.1:8081/api/theatres", {
                    method: "POST",
                    headers: {
                            'Content-Type': 'application/json',
                            'Authentication-Token': sessionStorage.getItem("token"),
                            'email': sessionStorage.getItem("email")
                            },
                    body: JSON.stringify(data)
                    }).
                    then((response) => {if (response.ok) {
                        return response.json()
                        }
                        else {
                            throw new Error('Error: ' + response.status)
                        }
                    }).
                    catch((e) => {
                        console.log(e)
                    })          
            if (Number(success) === 1){
                this.$router.push('/admin_dashboard');
            }
            else {
                alert("Theatre already exists!/ Name or Location field is empty!")
            }
        }
    }
})