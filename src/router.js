import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from './stores/user'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'

//Para las rutas protegidas 
const requireAuth = async(to, from, next) => {
    //Para usar un store afuera de los componenetes se debe de colocar dentro de una función no en el archivo raíz.
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await userStore.currentUser();

    if (user) {
        next();
    } else {
        next('/login');
    }

    userStore.loadingSession = false;
}

const routes = [
    { path: '/', component: Home, beforeEnter: requireAuth },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router;