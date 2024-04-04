import {Show_} from "./shows.js"

const Theatre_ = Vue.component("theatre_", {
    data: function() {
        return {
            name: "",
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
                <div> <p class="justify-content-left vertical-centre"><h5>{{ theatre.name }}</h5></p></div>
            </div>
            <div class="col-8">
                <div>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" v-model="name" placeholder="Show Name" />
                    </div>
                </div>
            </div>
            <div class="col-2">
                <div> <p class="justify-content-left vertical-centre"><h5>{{ theatre.location }}</h5></p></div>
            </div>
        </div>
        <div class="row">
            <div v-for="show in shows">
                <show_ v-bind:show="show"></show_>
            </div>
        </div>
        <div class="row">
            <div class="col-1 d-flex justify-content-start align-items-center">
            </div>
            <div class="col-10 d-flex justify-content-center align-items-center">
            </div>
            <div class="col-1 d-flex justify-content-end align-items-center">
            </div>
        </div>
    </div>
    `,
    components: {
        Show_
    },
    computed: {
        shows: function(){
            if(this.name === ""){
                return this.theatre.shows
            }
            else {
                let regex = new RegExp(this.name, 'i')
                let matched_shows = []
                for(const show of this.theatre.shows){
                    if(regex.test(show.name)) {
                        matched_shows.push(show)
                    }
                }
                return matched_shows
            }
        }
    }
})

export const Theatres_ = Vue.component("theatres_", {
    data: function(){
        return {
            theatres_: [],
            location: ""
        }
    },
    template:
    `
    <div>
        <div v-if="theatres_.length === 0" class="container">
            <div class="row vertical-centre text-centre">
                <div class="col-2"></div>
                <div class="col-8"><h2>There are no theatres!</h2></div>
                <div class="col-2"></div>
            </div>
        </div>
        <div v-else>
            <div class="container ">
                <div class="row">
                    <div class="col-4">
                    </div>
                    <div class="col-4 d-flex justify-content-center">
                        <div>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" v-model="location" placeholder="Theatre Location"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                    </div>
                </div>
                <div v-for="theatre in theatres" class="row border border-secondary rounded">
                    <theatre_ v-bind:theatre="theatre"></theatre_>
                </div>
            </div>
        </div>
    </div>`
    ,
    mounted: async function(){
        console.log("In mounted")
        try {
            this.theatres_ = await fetch("http://127.0.0.1:8081/api/theatres", {
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": sessionStorage.getItem("token")
            }
            }).
            then((data) => {return data.json()})
        }
        catch(e) {
            alert("Please login first!")
        }
    },
    computed: {
        theatres: function(){
            if (this.location === ""){
                return this.theatres_
            }
            else {
                let regex = new RegExp(this.location, 'i')
                let matched_theatres = []
                for (const theatre of this.theatres_){
                    if (regex.test(theatre.location)) {
                        matched_theatres.push(theatre)
                    }
                }
                return matched_theatres
            }
        }
    }
})