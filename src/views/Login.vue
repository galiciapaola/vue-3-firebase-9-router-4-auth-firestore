<script setup>
import { reactive, ref } from 'vue';
import { useUserStore} from '../stores/user'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const userStore = useUserStore()
const router = useRouter()

const formState = reactive({
    email: 'test@test.com',
    password: '1234567890'
})

// const email = ref('')
// const password = ref('')

 /*const handleSubmit = async() => {
    /* if (!email.value || !password.value.length > 6) {
        return alert('Llenar dato');
    } 
    
    // await userStore.loginUser(email.value, password.value)
    
    // router.push('/')
} */

const onFinish = async(values) => {
    console.log('Success: ', values);
    const result = await userStore.loginUser(formState.email, formState.password)

    if(!result) {
        return;
    }

    switch (result) {
        case "auth/user-not-found": 
            message.error('No existe esa cuenta');
            break;
        case "auth/wrong-password":
            message.error('Error de contraseña');
            break;
        default:
            message.error('Algo falló en firebase');
            break;
    }
}
</script>

<template>
    <a-row>
        <a-col :xs="{span:24}" :sm="{span:12, offset:6}">
            <a-form 
                name="login" 
                layout="vertical" 
                :model="formState"
                @finish="onFinish" 
            >

                <a-form-item name="email" label="Email" :rules="[{type: 'email', required: true, whitespace: true, message: 'Introduce un correo válido'}]">
                    <a-input v-model:value="formState.email"></a-input>
                </a-form-item>

                <a-form-item name="password" label="Password" :rules="[{required: true, whitespace: true, min: 6, message: 'Introduce tu contraseña'}]">
                    <a-input-password v-model:value="formState.password"></a-input-password>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit" :disabled="userStore.loadingUser" :loading="userStore.loadingUser">Acceso</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>