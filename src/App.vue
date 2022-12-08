<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from './stores/user'

const userStore = useUserStore();
const route = useRoute();
const selectedKeys = ref([route.name]);

watch(() => route.name,  () =>{
  selectedKeys.value = [route.name]
});

</script>

<template>
  <a-layout class="layout">
    <a-layout-header v-if="!userStore.loadingSession">      
      <a-menu theme="dark" mode="horizontal" v-model:selectedKeys="selectedKeys">
          <a-menu-item v-if="userStore.userData" key="home"><router-link to="/">Home</router-link></a-menu-item>
          <a-menu-item v-if="!userStore.userData" key="login"><router-link to="/login">Login</router-link></a-menu-item>
          <a-menu-item v-if="!userStore.userData" key="register"><router-link to="/register">Register</router-link></a-menu-item>
          <a-menu-item @click="userStore.logoutUser" v-if="userStore.userData" key="logout">Logout</a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content>
      <div :style="{padding: '20px'}">
        <div v-if="userStore.loadingSession">
          Loading user...
        </div>

        <div>
          <router-view></router-view>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>