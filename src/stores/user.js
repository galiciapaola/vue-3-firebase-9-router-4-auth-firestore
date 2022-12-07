import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { defineStore } from "pinia";
import { auth } from "../firebaseConfig";
import router from '../router'
import { useDatabaseStore } from './database'

//Export nombrado para poderlo usar en todos los componentes
export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false
    }),
    actions: {
        async registerUser(email, password) {
            this.loadingUser = true;
            try {
                const {user} = await createUserWithEmailAndPassword(auth, email, password);
                
                this.userData = {email: user.email, uid: user.uid}
                router.push("/");
            } catch (error) {
                console.log(error)
            } finally {
                this.loadingUser = false;
            }
        },
        async loginUser(email, password) {
            this.loadingUser = true ;

            try {
                const {user} = await  signInWithEmailAndPassword(auth, email, password);
                this.user = {email: user.email, uid: user.uid}
                router.push("/");
            } catch (error) {
                console.log(error)
            } finally {
                this.loadingUser = false;
            }
        },
        async logoutUser() {
            //Este no debe de estar afuera de la función
            const databaseSotore = useDatabaseStore();
            databaseSotore.$reset();

            try {
                await signOut(auth)
                this.userData = null;
                router.push("/login");
            } catch (error) {
                console.log(error);
            }
        },
        currentUser() {
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(auth, user => {
                    if (user) {
                        this.userData = {email: user.email, uid: user.uid}
                    } else {
                        this.userData = null;
                        const databaseSotore = useDatabaseStore();
                        databaseSotore.$reset();
                    }
                    resolve(user);
                }, e => reject(e))
                
                unsuscribe();
            })
        } 
    }
})