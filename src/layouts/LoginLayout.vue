<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LoginLayout'
}
</script>

<style lang="stylus" scoped>
.container
  background beige
  display flex
  align-items center
</style>
