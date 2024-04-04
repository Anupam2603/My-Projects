const Row = Vue.component('row', {
    data: function(){
        return {
            tickets: -1
        }
    },
    props: {
        show: {
            type: Object,
            required: true
        },
        user_id: {
            type: Number,
            required: true
        }
    },
    template:
    `
    <div class="row">
        <div class="col-2 border border-collapse">
            {{show.name}}
        </div>
        <div class="col-2 border border-collapse">
            {{tickets}}
        </div>
        <div class="col-2 border border-collapse">
            {{show.date}}
        </div>
        <div class="col-2 border border-collapse">
            {{show.time}}
        </div>
        <div class="col-2 border border-collapse">
            {{show.theatre.name}}
        </div>
        <div class="col-2 border border-collapse">
            {{show.theatre.location}}
        </div>
    </div>
    `,
    mounted: async function(){
                const tickets_obj = await fetch("http://127.0.0.1:8081/api/profile", {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/JSON",
                        'Authentication-Token': sessionStorage.getItem("token"),
                        "email": sessionStorage.getItem("email")
                    },
                    body: JSON.stringify({"show_id": this.show.show_id, "user_id": this.user_id})
                }).
                then((response) => {
                    if(response.ok){
                        return response.json()
                    }
                    else {
                        throw new Error("Error:"+response.status)
                    }
                }). 
                catch((e) => {console.log(e);alert("There is some server issue!"); return -1})
                this.tickets = tickets_obj.tickets
    }
})

export const Profile = Vue.component('profile', {
    data: function(){
        return {
            shows: [],
            user_id: 0
        }
    },
    template:
    `
    <div>
        <div class="d-flex justify-content-center align-items-center"><h2>Your Shows</h2></div>
        <div class="container">
            <div class="row border">
                <div class="col-2 border border-collapse">
                    <b>Show Name</b>
                </div>
                <div class="col-2 border border-collapse">
                    <b>Tickets</b>
                </div>
                <div class="col-2 border border-collapse">
                    <b>Date</b>
                </div>
                <div class="col-2 border border-collapse">
                    <b>Time</b>
                </div>
                <div class="col-2 border border-collapse">
                    <b>Theatre</b>
                </div>
                <div class="col-2 border border-collapse">
                    <b>Location</b>
                </div>
            </div>
            <div v-for="show in shows" class="row border">
                <row v-bind:show="show" v-bind:user_id="user_id"></row>
            </div>
        </div>
    </div>
    `,
    mounted: async function(){
        const user_info = await fetch("http://127.0.0.1:8081/api/profile", {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": sessionStorage.getItem('token'),
                "email": sessionStorage.getItem("email")
            }
          }).
          then(response => response.json()).
          catch((e) => {alert("There is some server issue!")})
        this.shows = user_info.shows
        this.user_id = user_info.id
        console.log(user_info, this.shows, this.user_id)
    }
})