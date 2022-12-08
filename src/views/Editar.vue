<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { useDatabaseStore } from '../stores/database'
import { message } from 'ant-design-vue'

const route = useRoute();
const databaseStore = useDatabaseStore();

const formState = reactive({
    url: ""
});

onMounted(async() => {
    formState.url = await  databaseStore.readUrl(route.params.id);
})

const onFinish = async (values) => {
    const result = await databaseStore.updateUrl(route.params.id, formState.url);

    if (!result) {
        formState.url = '';
        return message.success('URL editada');
    }

    switch(result) {
        default:
            message.error('Ocurrio un error');
            break;
    }
    
}
</script>

<template>
    <a-row>
        <a-col :xs="{span:24}" :sm="{span:12, offset:6}">
            <h1>Editar id: {{route.params.id}}</h1>

            <a-form
                name="editForm"
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
                    >Editar URL</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>