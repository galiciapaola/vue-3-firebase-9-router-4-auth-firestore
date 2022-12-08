<script setup>
import { useUserStore} from '../stores/user'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig';
import { useDatabaseStore } from '../stores/database';
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

onAuthStateChanged(auth, (user) => {
    console.log(user)
})

databaseStore.getUrls();

const confirm = async (id) => {
    const result = await databaseStore.deleteUrl(id);
    if (!result) return message.success('Se eliminó con éxito');
    return message.error(error);
} 
const cancel = () => {
    message.error('No se eliminó');
}

const copiarPortapapeles = (id) => {
    if (!navigator.clipboard) {
        return message.error('No se pudo copiar');
    }

    const path = `${window.location.origin}/${id}`;

    navigator.clipboard.writeText(path)
        .then(() => {
            message.success('Url copiada');
        })
        .catch(error => {
            message.error('No se pudo copiar');
        })

}
</script>

<template>
    <a-row>
        <a-col :xs="{span:24}" :sm="{span:12, offset:6}">
            <h1>Home</h1>
            <p>{{userStore.userData?.email}}</p>

            <add-form></add-form>

            <p v-if="databaseStore.loadingDoc">Loading docs...</p>

            <a-space 
                direction="vertical"
                style="width: 100%"
            >
                <a-card 
                    v-for="item of databaseStore.documents"  
                    :key="item.id"
                    :title="item.short" 
                    style="width: 100%"
                >
                    <template #extra>
                        <a-space>
                            <a-popconfirm
                                title="Seguro de que lo quieres eliminar?"
                                ok-text="Sí"
                                cancel-text="No"
                                @confirm="confirm(item.id)"
                                @cancel="cancel"
                            >
                                <a-button danger :loading="databaseStore.loading" :disabled="databaseStore.loading">Eliminar</a-button>
                            </a-popconfirm>
                            <a-button type="primary" @click="router.push(`/editar/${item.id}`)">Editar</a-button>
                            <a-button @click="copiarPortapapeles(item.id)">Copiar</a-button>
                        </a-space>
                    </template>
                    <p>{{item.name}}</p>
                </a-card>
            </a-space>
        </a-col>
    </a-row>
</template>