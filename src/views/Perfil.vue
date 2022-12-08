<script setup>
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const handleSubmit = async() => {
    await userStore.updateUser(userStore.userData.displayName);
}
</script>

<template>
    <h1>Perfil de usuario</h1>

    <form @submit.prevent="handleSubmit">
        <input type="email" disabled placeholder="Email" v-model.trim="userStore.userData.email" />
        <input type="text" placeholder="Display Name" v-model.trim="userStore.userData.displayName" />
        <button type="submit" :disabled="userStore.loadingUser">Actualizar información</button>
    </form>
</template>