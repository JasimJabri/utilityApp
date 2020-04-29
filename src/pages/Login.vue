<template>
  <q-page class="fit row  justify-center items-center content-center">
    <div style="width: 80vw; max-width: 500px;">
    <div class="banner">
      Utility Manager
    </div>
         <q-form
        @submit="onSubmit"
        class="q-gutter-md"
      >
          <q-input
          filled
          v-model="username"
          label="Email"
          lazy-rules
          :rules="[
            val => !!val || '* Required', 
            val => val && val.length > 3 || 'Please use atleast 4 characters',

          ]"
        ></q-input>
  <br>
        <q-input
          filled
          type="password"
          v-model="password"
          label="Password"
          hint="Enter your secret password"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Please type a password',
            val => val.length >= 6 || 'Please use atleast 6 characters'
          ]"
        ></q-input>
  
  <br>
        <div class="row justify-around">
          <q-btn label="Login" type="submit" class="bg-black text-white"></q-btn>
          <q-btn label="Register" to="/register" class="bg-black text-white"></q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import firebase from 'firebase/app'
export default {
  name: 'Login',
  data: () => {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    onSubmit() {
      firebase.auth()
      .signInWithEmailAndPassword(this.username, this.password)
      .then(user => {
        this.setStorage().then(() => {
          this.$q.loading.hide()
          this.$router.replace('/')
        }
        )
        this.$q.notify({message: `${user.user.displayName} logged in successfully!`, type: 'positive', timeout: 1000})
        this.$q.localStorage.set('user', user.user.uid)
      })
      .catch(error => {
        var errorMessage = error.message
        this.$q.loading.hide()
        this.$q.notify({message: `${errorMessage}`, type: 'negative'})
      })
    },
     async setStorage () {
      this.$q.localStorage.set('isLoggedIn', true)
      console.log('User name set')
      return true
    }
  }
}
</script>

<style lang="stylus">
.banner
  left (50%-175)
  font-size 36px
  font-weight bold
  letter-spacing 2px
  word-spacing 3px
  padding-bottom 60px
  text-align center
</style>