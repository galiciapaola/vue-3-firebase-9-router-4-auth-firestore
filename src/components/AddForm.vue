<script setup>
import { reactive } from 'vue';
import { useUserStore} from '../stores/user'
import { useDatabaseStore } from '../stores/database'
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const databaseStore = useDatabaseStore();

const formState = reactive({
    url: ''
})

const onFinish = async (values) => {
    const result = await databaseStore.addUrl(formState.url);

    if (!result) {
        formState.url = '';
        return message.success('URL agregada');
    }

    switch(result) {
        default:
            message.error('Ocurrio un error');
            break;
    }
    
}
</script>

<template>
    <a-form
        name="addForm"
        autocomplete="off"
        layout="vertical"
        :model="formState"
        @finish="onFinish"
    >
        <a-form-item
            name="url"
            label="Ingresa una URL"
            :rules="[{
                required: true,
                whitespace: true,
                pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                message: 'Ingrese una URL válida'
            }]"
        >
            <a-input v-model:value="formState.url">
            </a-input>
        </a-form-item>
    
        <a-form-item>
            <a-button
                type="primary"
                html-type="submit"
                :disabled="databaseStore.loading"
                :loading="databaseStore.loading"
            >Agregar URL</a-button>
        </a-form-item>
    </a-form>
</template>