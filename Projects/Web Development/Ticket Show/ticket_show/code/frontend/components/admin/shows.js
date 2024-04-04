export const Show = Vue.component("show", {
    data: function(){
        return {
            flag: false
        }
    },
    props: {
        show: {
            type: Object,
            required: true
        }
    },
    template:
    `
    <div class="container border border-primary rounded">
        <div class="row">
            <div class="col-3">
            </div>
            <div v-if="flag === false"  class="col-6 d-flex justify-content-center">
                <h6>{{show.name}}</h6>
            </div>
            <div v-else class="col-6 d-flex justify-content-center">
                    <div class="form-group">
                        <input type="text" class="form-control" id="show_name" v-model:value="show.name" required/>
                    </div>
            </div>
            <div class="col-3">
            </div>
        </div>
        <div class="row">
            <div v-if="flag===false" class="col-3 d-flex justify-content-start">
                <p>{{show.date}}</p>
            </div>
            <div v-else class="col-3 d-flex justify-content-end">
                <div class="form-group">
                    <input type="date" class="form-control" id="date" v-model:value="show.date" required/>                        
                </div>
            </div>
            <div v-if="flag===false" class="col-3 d-flex justify-content-center">                    
                <p><b>Seats:</b><br/>
                    {{show.seats}}
                </p>
            </div>
            <div v-else class="col-3 d-flex justify-content-center">
                <div class="form-group">
                    <input type="text" class="form-control" id="seats" v-model:value="show.seats" required/>
                </div>
            </div>
            <div v-if="flag===false" class="col-3 d-flex justify-content-center">
                <p><b>Price:</b>
                    <br/>{{show.price}}
                </p>
            </div>
            <div v-else class="col-3 d-flex justify-content-center">
                <div class="form-group">
                    <input type="number" class="form-control" id="price" v-model:value="show.price" required/>
                </div>
            </div>
            <div v-if="flag===false" class="col-3 d-flex justify-content-end">
                <p>{{show.time}}</p>
            </div>
            <div v-else class="col-3 d-flex justify-content-end">
                <div class="form-group">
                    <input type="time" class="form-control" id="time" v-model:value="show.time" required/>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-3 d-flex justify-content-start">
                <div v-if="flag===false"><button type="button" v-on:click="flag_toggle()" class="btn btn-primary">Update</button></div>
                <div v-else><button type="button"  v-on:click="update()" class="btn btn-primary">Save</button></div>
            </div>
            <div class="col-5 justify-content-center">
            </div>
            <div class="col-4 d-flex justify-content-end">
                <button type="button"  v-on:click="confirmDelete()" class="btn btn-primary">Delete</button>
            </div>
        </div>
    </div>
        
    `,
    methods: {
        flag_toggle: function(){
            this.flag = !this.flag
        },
        update: async function(){
            const name = document.getElementById('show_name').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const seats = document.getElementById('seats').value;
            const price = document.getElementById('price').value;
            if (name==="" || date === "" || time === "" || Number(price) < 0 || Number(seats) < 0){
                alert("Some of the fields are empty or Price/Seats is negative")
                return 0
            }
            const theatre_id = this.show.theatre_id;
            const show_id = this.show.show_id
            console.log(name,date, time, seats, price, theatre_id, show_id)
            this.show.name = name
            this.show.date = date
            this.show.time = time
            this.show.price = price
            this.show.seats = seats
            const data = {"show_id": show_id, "name": name, "date": date, "time": time, "seats": seats, "price": price, "theatre_id": theatre_id}
            const success = await fetch("http://127.0.0.1:8081/api/shows", {
                    method: "PUT",
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
            this.flag = !this.flag          
            if (Number(success) === -1) {
                alert("There is no show with give details!")
            }
            else if (Number(success) === 0){
                alert("Show already exists with given details!/ Some of the fields are empty!")
            }
        },
        confirmDelete: async function(){
            if (window.confirm("Are you sure you want to delete the show?")) {
                // Code to delete the item
                const data = {"id": this.show.show_id}
                const success = await fetch("http://127.0.0.1:8081/api/shows", {
                    method: "DELETE",
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
                this.$destroy()
                console.log("Item deleted");
                location.reload()
              } else {
                // Code to cancel the deletion
                console.log("Deletion canceled");
            }
        }
    }
})
