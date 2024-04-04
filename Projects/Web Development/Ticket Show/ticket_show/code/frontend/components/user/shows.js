export const Show_ = Vue.component("show_", {
    data: function(){
        return {
            flag: false,
            tickets: 0,
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
        <div v-if="flag===false">
            <div class="row">
                <div class="col-3">
                </div>
                <div v-if="flag === false"  class="col-6 d-flex justify-content-center">
                    <h6>{{show.name}}</h6>
                </div>
                <div class="col-3">
                </div>
            </div>
            <div class="row">
                <div v-if="flag===false" class="col-3 d-flex justify-content-start">
                    <p>{{show.date}}</p>
                </div>
                <div v-if="flag===false" class="col-3 d-flex justify-content-center">                    
                    <p><b>Seats:</b><br/>
                        {{show.seats}}
                    </p>
                </div>
                <div v-if="flag===false" class="col-3 d-flex justify-content-center">
                    <p><b>Price:</b>
                        <br/>{{show.price}}
                    </p>
                </div>
                <div v-if="flag===false" class="col-3 d-flex justify-content-end">
                    <p>{{show.time}}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-4 d-flex justify-content-start">
                </div>
                <div class="col-4 d-flex justify-content-center">
                    <div v-if="!housefull"><button type="button"  v-on:click="flag_toggle()" class="btn btn-primary">Book</button></div>
                    <div v-else><span style="color: red;">Housefull</span></div>
                </div>
                <div class="col-4 d-flex justify-content-end">
                </div>
            </div>
        </div>
        <div v-else>
            <div class="row">
                <div class="col-3">
                </div>
                <div class="col-6 d-flex justify-content-center">
                    <h6>Ticket Booking For {{show.name}} </h6>
                </div>
                <div class="col-3">
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="tickets">Number of Tickets:</label>
                    <input type="text" class="form-control" id="ticket" v-model:value="tickets" placeholder=""/>
                </div>
                <div class="form-group">
                    <label for="price">Price:</label>
                    <input type="text" class="form-control" id="price" v-bind:value="show.price" placeholder="" readonly/>
                </div>
                <div class="form-group">
                    <label for="time">Total:</label>
                    <input type="text" class="form-control" id="total" placeholder="" v-bind:value="total" readonly/>
                </div>
                <div class="col-4">
                </div>
                <div class="col-4 d-flex justify-content-center">
                    <button type="submit" v-on:click="confirm()" class="btn btn-success">confirm</button>
                </div>
                <div class="col-4">
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        flag_toggle: function(){
            this.flag = !this.flag
        },
        confirm: async function(){
            // Calling backend api to save data to database!
            const data = {"show_id": this.show.show_id, "tickets": this.tickets}
            const success = await fetch("http://127.0.0.1:8081/api/book", {
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
                        return {"success": 0}
                    })          
            if (Number(success.success) === 1){
                this.flag = !this.flag;
            }
            else {
                alert("There is some issue!")
                this.flag = !this.flag
            }
        }
    },
    computed: {
        total: function(){
            this.show.seats = this.show.seats - this.tickets
            return this.show.price * this.tickets
        },
        housefull: function(){
            if (this.show.seats > 0){
                return false
            }
            else {
                return true
            }
        }
    }
})
