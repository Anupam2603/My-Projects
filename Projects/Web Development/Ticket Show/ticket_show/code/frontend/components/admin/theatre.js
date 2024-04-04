import {Show} from "./shows.js"

const Theatre = Vue.component("theatre", {
    data: function(){
        return {
            flag: false
        }
    },
    props: {
        theatre: {
            type: Object,
            required: true
        }
    },
    template:
    `
    <div class="container">
        <div class="row">
            <div class="col-2">
                <div v-if="flag===true">
                    <h5>
                        <input type="text" class="form-control" id="theatre_name" v-model:value="theatre.name"/>
                    </h5>
                </div>
                <div v-else> <p class="justify-content-left vertical-centre"><h5>{{ theatre.name }}</h5></p></div>
            </div>
            <div class="col-8">
            </div>
            <div class="col-2">
                <div v-if="flag===true">
                    <h5>
                        <input type="text" class="form-control" id="location" v-model:value="theatre.location"/>
                    </h5>
                </div>
                <div v-else> <p class="justify-content-left vertical-centre"><h5>{{ theatre.location }}</h5></p></div>
            </div>
        </div>
        <div class="row">
            <div v-for="show in theatre.shows">
                <show v-bind:show="show"></show>
            </div>
            <div class="col vertical-center">
                <router-link :to="{ path: '/admin_dashboard/createshow', query: {theatre_id: theatre.theatre_id } }">
                    <i class="fas fa-10x bi bi-plus-circle-fill"></i>
                </router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-1 d-flex justify-content-start align-items-center">
                <div v-if="flag===false"><button type="button" v-on:click="flag_toggle()" class="btn btn-link">Update</button></div>
                <div v-else><button type="button"  v-on:click="update()" class="btn btn-primary">Save</button></div>
            </div>
            <div class="col-10 d-flex justify-content-center align-items-center">
                <button type="button"  v-on:click="exportdetails()" class="btn btn-info">Export Detail</button>
            </div>
            <div class="col-1 d-flex justify-content-end align-items-center">
                <button type="button"  v-on:click="confirmDelete()" class="btn btn-link">Delete</button>
            </div>
        </div>
    </div>
    `,
    components: {
        Show
    },
    methods: {
        flag_toggle: function(){
            console.log(this.theatre.theatre_id)
            this.flag = !this.flag
        },
        update: async function(){
            // Calling backend api to save data to database!
            //this.theatres[index]
            const name = document.getElementById('theatre_name').value;
            const location = document.getElementById('location').value;
            if (name==="" || location===""){
                alert("Some of the fields are empty!")
                return 0
            }
            const theatre_id = this.theatre.theatre_id;
            this.theatre.name = name
            this.theatre.location = location
            const data = {"name": name, "location": location, "theatre_id": theatre_id}
            const success = await fetch("http://127.0.0.1:8081/api/theatres", {
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
            if (Number(success) === -1) {
                alert("There is no theatre with give details!")
            }
            else if (Number(success) === 0){
                alert("Show already exists with given details!/ Some of the fields are empty!")
            }
            this.flag = !this.flag
        },
        confirmDelete: async function(){
            if (window.confirm("Are you sure you want to delete this item?")) {
                // Code to delete the item
                if (this.theatre.shows.length === 0) {
                    const data = {"id": this.theatre.theatre_id}
                    const success = await fetch("http://127.0.0.1:8081/api/theatres", {
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
                    if (Number(success) === 0){
                        alert("There are shows in this theatre! First delete all the shows from theatre!")
                    }
                    this.$destroy()
                    location.reload()
                }
                else {
                    alert("There are shows in this theatre! First delete all the shows from theatre!")
                }
                
            } 
            else {
                // Code to cancel the deletion
                console.log("Deletion canceled");
            }
        },
        exportdetails: async function(){
            var task_id = await fetch("http://127.0.0.1:8081/api/export_details/"+this.theatre.theatre_id, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem("token")
                    }
                }).then((response) => {return response.json()})
            await fetch("http://127.0.0.1:8081/api/download/"+task_id.task_id,{
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': sessionStorage.getItem("token")
                    }
            }).
            then((response) => {
                if(response.status === 202){
                    console.log("Process is still in progress")
                }
                else{
                    let csvData;
                    const csvData_object = response.text();
                    csvData_object.then((result) =>{
                        const blob = new Blob([result], { type: "text/csv" });
                        const url = URL.createObjectURL(blob);
                        const downloadLink = document.createElement("a");
                        downloadLink.href = url;
                        downloadLink.download = this.theatre.name+".csv";
                        downloadLink.click()

                        }
                    )
                }
            })
        }
    },
})

export const Theatres = Vue.component("theatres", {
    data: function(){
        return {
            theatres: []
        }
    },
    template:
    `
    <div>
        
        <div v-if="theatres.length === 0" class="container">
            <div class="row vertical-centre text-centre">
                <div class="col-2"></div>
                <div class="col-8"><h2>There are no theatres!</h2></div>
                <div class="col-2"></div>
            </div>
        </div>
        <div v-else>
            <div class="container ">
                <div v-for="theatre in theatres" class="row border border-secondary rounded">
                    <theatre v-bind:theatre="theatre"></theatre>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-2"></div>
                <div class="col-8 d-flex justify-content-center align-items-center"><router-link to="/admin_dashboard/createtheatre">Create a new Theatre!</router-link></div>
                <div class="col-2"></div>
            </div>
        </div>
    </div>`
    ,
    mounted: async function(){
        this.theatres = await fetch("http://127.0.0.1:8081/api/theatres", {
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': sessionStorage.getItem("token")
            }
        }).
                        then((data) => {return data.json()})
    }
})