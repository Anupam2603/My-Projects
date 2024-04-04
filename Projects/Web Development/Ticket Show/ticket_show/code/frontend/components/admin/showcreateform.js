export const ShowCreateForm = Vue.component("create_form", {
    props: {
        theatre_id:{
            type: String,
            required: true
        }
    },
    template:
    `
    <div class="container ">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="vertical-center"><h3>New Show Details:</h3></div>
                <div class="vertical-center">
                    <form id="show_create_form" >
                        <div class="form-group">
                            <h5>
                                <label for="name">Name:</label><span style="color: red;">*</span>
                                <input type="text" class="form-control" id="name" placeholder="Enter Show Name" required/>
                            </h5>
                        </div>
                        <div class="form-group">
                            <h5>
                                <label for="date">Date:</label><span style="color: red;">*</span>
                                <input type="date" class="form-control" id="date" placeholder="Enter Date" required/>
                            </h5>
                        </div>
                        <div class="form-group">
                            <h5>
                                <label for="time">Time:</label><span style="color: red;">*</span>
                                <input type="time" class="form-control" id="time" placeholder="Enter Time" required/>
                            </h5>
                        </div>
                        <div class="form-group">
                            <h5>
                                <label for="seatss">Seats:</label><span style="color: red;">*</span>
                                <input type="text" class="form-control" id="seats" placeholder="Enter Seats" required/>
                            </h5>
                        </div>
                        <div class="form-group">
                            <h5>
                                <label for="location">Price:</label><span style="color: red;">*</span>
                                <input type="number" min="0" class="form-control" id="price" placeholder="Enter Price" required/>
                            </h5>
                        </div>
                        <button type="submit" v-on:click="submit()" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        submit: async function(){{
            const form = document.getElementById('show_create_form');
            const name = form.elements['name'].value;
            const date = form.elements['date'].value;
            const time = form.elements['time'].value;
            const seats = form.elements['seats'].value;
            const price = form.elements['price'].value;
            const theatre_id = this.theatre_id;
            const data = {"name": name, "date": date, "time": time, "seats": seats, "price": price, "theatre_id": theatre_id}
            const success = await fetch("http://127.0.0.1:8081/api/shows", {
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
                alert("Show already exists!/ Some of the fields are empty!")
            }
        }
    }
    }
})