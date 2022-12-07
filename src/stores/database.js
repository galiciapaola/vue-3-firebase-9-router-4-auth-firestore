import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore/lite';
import { defineStore } from 'pinia'
import { db, auth } from '../firebaseConfig';
import { nanoid } from 'nanoid'
import router from '../router';

export const useDatabaseStore = defineStore('database', {
    state: () => ({
        documents: [],
        loadingDoc: false
    }),
    actions: {
        async getUrls() {
            if (this.documents.length !== 0) {
                return;
            }

            this.loadingDoc = true;
            
            try {
                const q = query(collection(db, 'urls'), where('user', "==", auth.currentUser.uid));

                //Llamada a la base de datos
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(doc => {
                    console.log(doc.id, doc.data());
                    this.documents.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false;
            }
        },
        async addUrl(name) {
            try {
                const objetoDoc = {
                    name: name,
                    //String aleatorio de 6 caracteres
                    short: nanoid(6),
                    user: auth.currentUser.uid
                }

                const docRef = await addDoc(collection(db, 'urls'), objetoDoc)
                console.log(docRef.id);

                this.documents.push({
                    ...objetoDoc,
                    id: docRef.id
                })
            } catch (error) {
                console.log(error);
            } finally {

            }
        },
        async deleteUrl(id) {
            try {
                const docRef = doc(db, 'urls', id);

                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error("no existe el doc");
                }

                if (docSnap.data().user !== auth.currentUser.uid) {
                    throw new Error("no le pertenece ese documento");
                }

                await deleteDoc(docRef);

                //Para borrar el documento de la lista en el front
                this.documents = this.documents.filter(item => item.id !== id)
            } catch (error) {
                console.log(error.message);
            } finally {

            }
        },
        async readUrl(id) {
            try {
                const docRef = doc(db, 'urls', id);
                const docSnapshot = await getDoc(docRef);

                if(!docSnapshot.exists()) {
                    throw new Error("no existe el doc");
                }

                if (docSnapshot.data().user !== auth.currentUser.uid) {
                    throw new Error("no le pertenece ese documento");
                }

                return docSnapshot.data().name;
            } catch (error) {
                console.log(error.message);
            } finally {

            }
        },
        async updateUrl(id, name) {
            try {
                const docRef = doc(db, 'urls', id);
                const docSnapshot = await getDoc(docRef);

                if (!docSnapshot.exists()) {
                    throw new Error("no existe el doc");
                }

                if (docSnapshot.data().user !== auth.currentUser.uid) {
                    throw new Error("no le pertenece ese documento");
                }

                await updateDoc(docRef, {
                    name: name
                })

                //El map debe devolver todos los elementos en cuestión
                this.documents = this.documents.map(item => item.id === id ? ({...item, name: name}) : item)
                router.push("/");

            } catch (error) {
                console.log(error.message)
            } finally {

            }
        }
    }
})