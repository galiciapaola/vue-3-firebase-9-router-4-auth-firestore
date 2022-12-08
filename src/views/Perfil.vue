<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const handleSubmit = async() => {
    await userStore.updateUser(userStore.userData.displayName);

    
}

</script>

<template>
    <h1>Perfil de usuario</h1>

    <form @submit.prevent="handleSubmit">
        <input type="email" disabled placeholder="Email" v-model.trim="userStore.userData.email" /> <br><br>
        <input type="text" placeholder="Display Name" v-model.trim="userStore.userData.displayName" /> <br><br>
        <input type="file" ref="file" /> <br><br>
        <button>Subir Imagen</button> <br><br>
        <button type="submit" :disabled="userStore.loadingUser">Actualizar información</button>
    </form>
</template>