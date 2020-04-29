<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-black glossy">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>
        <q-toolbar-title
          style="font-size: 20px;text-transform: uppercase; letter-spacing: 1px; font-weight: 500; word-spacing: 2px;"
        >{{this.$route.meta.title}}</q-toolbar-title>
        <q-btn
          v-if="$route.meta.buttons"
          :to="$route.meta.buttons.path"
          :icon="$route.meta.buttons.icon"
          :label="$route.meta.buttons.label"
         >
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      content-class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list v-for="(menuItem, index) in menuList" :key="index">
          <q-item  clickable :to="menuItem.path" v-ripple>
            <q-item-section avatar>
              <q-icon :name="menuItem.icon"></q-icon>
            </q-item-section>
            <q-item-section>{{ menuItem.label }}</q-item-section>
          </q-item>

          <q-separator v-if="menuItem.separator"></q-separator>
        </q-list>
        <q-list class="fit">

         <q-item clickable @click.native="logout()">
          <q-item-section avatar>
             <q-icon name="exit_to_app"></q-icon>
          </q-item-section>
          <q-item-section>
            Logout
          </q-item-section>
        </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: "MyLayout",

  data() {
    return {
      drawer: false,
      left: false,
      menuList
    };
  },
  created() {
    this.head_title = this.$route.fullPath.slice(1).toUpperCase();
  },
  methods: {
    logout () {
      this.$q.dialog({
        title: 'Logout',
        message: 'Are you sure?',
        ok: 'Ok',
        cancel: true,
        persistent: true
        }).onOk(() => {
        firebase.auth().signOut().then(() => {
          this.$q.localStorage.set('isLoggedIn', false)
          this.$q.localStorage.set('user', '')
          this.$q.notify({message: `User Logged out successfully`, type: 'negative', timeout: 800})
          this.$router.replace('/login')
        })
        })
    }
  }
};
const menuList = [
  {
    icon: "account_balance",
    label: "Bills",
    path: "/bills",
    separator: true
  },
  {
    icon: "home_work",
    label: "Properties",
    path: "/properties",
    separator: false
  },
  {
    icon: "tab",
    label: "Units",
    path: "/units",
    separator: false
  },
  {
    icon: "sports_volleyball",
    label: "Water",
    path: "/water",
    separator: false
  }
];
</script>
<style lang="stylus" scoped>
.container {
}
</style>
