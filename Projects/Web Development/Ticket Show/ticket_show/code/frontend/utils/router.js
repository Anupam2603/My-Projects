import {HomePage} from "../components/homepage.js";
import {AdminLogin} from "../components/admin/adminlogin.js";
import {UserLogin} from "../components/user/userlogin.js";
import {Register} from "../components/user/register.js";
import {AdminDashboard} from "../components/admin/admindashboard.js";
import {Theatres} from "../components/admin/theatre.js"
import { TheatreCreateForm } from "../components/admin/theatrecreateform.js";
import { ShowCreateForm } from "../components/admin/showcreateform.js";
import { UserDashboard } from "../components/user/userdashboard.js"
import { Theatres_ } from "../components/user/theatre.js";
import { Profile } from "../components/user/profile.js";

const routes = [
    {
        path: '/',
        component: HomePage
    },
    {
        path: '/admin_login',
        component: AdminLogin
    },
    {
        path: '/user_login',
        component: UserLogin
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/admin_dashboard',
        component: AdminDashboard,
        children: [
            {
                path:"",
                component: Theatres
            },
            {
                path:"createtheatre",
                component: TheatreCreateForm
            },
            {
                path: "createshow",
                component: ShowCreateForm,
                props: (route) => (route.query) //{ theatre_id: route.query }
            }
        ]
    },
    {
        path: '/user_dashboard',
        component: UserDashboard,
        children: [
            {
                path:"",
                component: Theatres_
            },
            {
                path:"profile",
                component: Profile
            }
        ]
    }
]
    
export const router = new VueRouter({
    routes
})