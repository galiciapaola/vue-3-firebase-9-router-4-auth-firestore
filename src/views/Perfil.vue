<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const fileList = ref([]);

const beforeUpload = (file) => {
    fileList.value = [...fileList.value, file];
    return false;
}

const onFinish = async() => {
    const result = await userStore.updateUser(userStore.userData.displayName);

    if (fileList.value[0]) {
        const resultIMG = await userStore.updateIMG(fileList.value[0]);

        if (resultIMG) {
            return error.success('Error con la carga de imagen');
        }

        return message.success('Se actualizó tu imagen');
    }

    if (!result) {
        return message.success('Se actualizó tu información');
    }

    message.error('Ocurrió un error');
    
}

const handleChange = info => {
    //Validar tipo de imagen
    if (info.file.status !== 'uploading') {
        const isJpgOrPng = info.file.type === 'image/jpg' || info.file.type === 'image/png';
        if(!isJpgOrPng) {
            message.error('Tipo de archivo no válido');
            handleRemove(info.file);
            return;
        }

        const isLt2M = info.file.size / 1024 / 1024 < 2;
        if(!isLt2M) {
            message.error('La imagen debe ser menos a 2MB');
            handleRemove(info.file);
            return;
        }
    }

    //Para que solo se pueda subir 1 imagen
    let resFileList = [...info.fileList];

    resFileList = resFileList.slice(-1);

    resFileList = resFileList.map(file => {
        if (file.response) {
            file.url = file.response.url;
        }

        return file;
    })

    fileList.value = resFileList;
}

const handleRemove = file => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
}

</script>

<template>
    <a-row>
        <a-col :xs="{span:24}" :sm="{span:12, offset: 6}">
            <h1>Perfil de usuario</h1>

            <a-avatar
                :src="userStore.userData.photoURL"
                :size="100"
            ></a-avatar>

            <a-form
                name="basicProfile"
                autocomplete="off"
                layout="vertical"
                :model="userStore.userData"
                @finish="onFinish"
            >
                <a-form-item
                    name="email"
                    label="Tu correo"
                    :rules="[{
                        required: true,
                        whitespace: true,
                        type: 'email',
                        message: 'Ingresa un email válido'
                    }]"
                >
                    <a-input
                        disabled
                        v-model:value="userStore.userData.email"
                    >
                    </a-input>
                </a-form-item>

                <a-form-item
                    name="displayName"
                    label="Ingresa tu nombre"
                    :rules="[{
                        required: true,
                        whitespace: true,
                        message: 'Ingresa tu nombre'
                    }]"
                >
                    <a-input
                        v-model:value="userStore.userData.displayName"
                    ></a-input>
                </a-form-item>

                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture"
                    :before-upload="beforeUpload"
                    :max-count="1"
                    @change="handleChange"
                >
                    <a-button
                    >Subir Imagen</a-button>
                </a-upload>

                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser"
                    >Actualizar información</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>