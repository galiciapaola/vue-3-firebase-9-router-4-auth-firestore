<script setup>
import { reactive } from 'vue';
import { useUserStore} from '../stores/user';
import { message } from 'ant-design-vue'

const userStore = useUserStore();

const formState = reactive({
    email: "",
    password: "",
    repassword: ""
});

const validatePass = async(_rule, value) => {
    if (value === '') {
        return Promise.reject('Repita contraseña');
    }

    if (value !== formState.password) {
        return Promise.reject('No coinciden las contraseñas');
    }

    return Promise.resolve();
}

const onFinish = async (values) => {
    console.log('Success: ', values);
    const result = await userStore.registerUser(formState.email, formState.password);

    if (!result) {
        return message.success('Verifica tu cuenta de correo');
    }

    switch (result) {
        case "auth/email-already-in-use": 
            message.error('Esta cuenta de usuario ya existe');
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
                name="register" 
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

                <a-form-item name="repassword" label="Confrim Passowrd" :rules="[{validator: validatePass}]">
                    <a-input-password v-model:value="formState.repassword"></a-input-password>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit" :disabled="userStore.loadingUser" :loading="userStore.loadingUser">Acceso</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>