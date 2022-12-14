import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from './stores/user'
import { useDatabaseStore } from './stores/database'

import Home from './views/Home.vue'
import Editar from './views/Editar.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Perfil from './views/Perfil.vue'
import NotFound from './views/NotFound.vue'

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

const redirect = async(to, from, next) => {
    const databaseStore = useDatabaseStore();
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const name = await databaseStore.getUrl(to.params.pathMatch[0]);
    
    if (!name) {
        next();
        userStore.loadingSession = false;
    } else {
        window.location.href = name;
        userStore.loadingSession = true;
        next();
    }
}

const routes = [
    { path: '/', component: Home, beforeEnter: requireAuth },
    { path: '/editar/:id', component: Editar, beforeEnter: requireAuth },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/perfil', component: Perfil, beforeEnter: requireAuth },
    { path: '/:pathMatch(.*)*', component: NotFound, beforeEnter: redirect },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router;