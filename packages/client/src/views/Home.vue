<template>
  <div class="home">
    <a @click="reset()" class="waves-effect waves-light btn">Reset Menu</a>
    <!-- <img src="../assets/logo.png">
    <ul>
      <li v-for="(menu, index) in menus" :key="index">
        <router-link :to="'/' + menu.id">{{ menu.title }}</router-link>
      </li>
    </ul> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { restClient } from '../services/rest-client';
import { Store } from '../services/store';
import HelloWorld from '../components/HelloWorld.vue'; // @ is an alias to /src
import router from '../router';
import About from './About.vue';

const log = console.log;

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  private menus: { id: string; title: string }[] = [];

  private mounted() {
    if (Store.isInitialized) { return; }
    Store.isInitialized = true;
    log('HELLO HOME');
    restClient
      .get('/menus')
      .then(response => {
        this.menus = response.data;
        router.addRoutes(this.menus.map(m => ({ path: m.id, name: m.title, component: About })));
        log(response.data);
      })
      .catch(error => log(error));
  }

  private reset() {
    restClient.post('/reset', { reset: true });
  }
}
</script>
