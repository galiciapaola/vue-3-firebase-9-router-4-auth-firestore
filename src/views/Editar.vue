<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import { useDatabaseStore } from '../stores/database'

const route = useRoute();
const databaseStore = useDatabaseStore();
console.log(route.params.id);

const handleSubmit = () => {
    databaseStore.updateUrl(route.params.id, url.value);
}

const url = ref('');

onMounted(async() => {
    const url = await  databaseStore.readUrl(route.params.id);
})


</script>

<template>
    <h1>Editar id: {{route.params.id}}</h1>

    <form @submit.prevent="handleSubmit">
        <input type="text" placeholder="Ingrese URL" v-model="url" />
        <button type="submit">Editar</button>
    </form>
</template>