import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { defineStore } from "pinia";
import { auth, db } from "../firebaseConfig";
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
        async setUser(user) {
            try {
                //Como hacer una nueva colección 
                const docRef = doc(db, "users", user.uid);
                
                this.userData = {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                }

                await setDoc(docRef, this.userData);

            } catch (error) {
                console.log(error);
            }
        },
        async loginUser(email, password) {
            this.loadingUser = true ;

            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                await this.setUser(user);
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
                router.push("/login");
                await signOut(auth)
            } catch (error) {
                console.log(error);
            }
        },
        currentUser() {
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(auth, async user => {
                    if (user) {
                        this.userData = {
                            email: user.email,
                            uid: user.uid,
                            displayName: user.displayName,
                            photoURL: user.photoURL
                        }
                    } else {
                        this.userData = null;
                        const databaseSotore = useDatabaseStore();
                        databaseSotore.$reset();
                    }
                    resolve(user);
                }, e => reject(e))
                
                unsuscribe();
            })
        },
        async updateUser(displayName) {
            try {
                await updateProfile(auth.currentUser, {
                    displayName: displayName
                })

                this.setUser(auth.currentUser);
            } catch (error) {
                console.log(error.code);
                return error.code;
            }
        } 
    }
})