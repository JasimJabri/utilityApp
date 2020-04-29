<template>
  <q-page class="fit row  justify-center items-center content-center">
    <div  style="width: 80vw; max-width: 500px;">
         <q-form
        @submit="onSubmit"
        class="q-gutter-md"
      >

          <q-input
          filled
          v-model="username"
          label="Username"
          lazy-rules
          :rules="[
            val => !!val || '* Required', 
            val => val && val.length > 3 || 'Please use atleast 4 characters',

          ]"
        ></q-input>
  <br>
                   <q-input
          filled
          v-model="email"
          label="Email"
          lazy-rules
          :rules="[
            val => !!val || '* Required', 
            val => validateEmail(val) || 'Please enter a valid email address'

          ]"
        ></q-input>
  <br>
        <q-input
          filled
          type="password"
          v-model="password"
          label="Password"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Please type a password',
            val => val.length >= 6 || 'Please use atleast 6 characters'
          ]"
        ></q-input>


  <br>
        <div class="row justify-center">
          <q-btn label="Submit" type="submit" class="bg-black text-white"></q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import firebase from 'firebase/app'
import {db} from '../db.js'
export default {
  name: 'Register',
  data: () => {
    return {
      username: '',
      password: '',
      email: ''
    }
  },
  methods: {
    onSubmit() {
        firebase.auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            let currentUser = firebase.auth().currentUser
            this.$q.localStorage.set('isLoggedIn', true)
            this.$q.localStorage.set('user', currentUser.uid)
            db.collection('utility_manager').doc(currentUser.uid).set({
              name: this.username
            })
            currentUser.updateProfile({
              displayName: this.username
            }).then(() => {
              this.$q.notify({message: `${this.username} registered successfully!`, type: 'positive'})
              this.$q.loading.hide()
              this.$router.push('/login')
            })
          })
          .catch(error => {
            var errorMessage = error.message
            this.$q.notify({message: `${errorMessage}`, type: 'negative'})
            this.$q.loading.hide()
          })
    },
    validateEmail(email) 
    {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      {
        return (true)
      }
        return (false)
    }
  }
}
</script>

<style lang="stylus">
</style>