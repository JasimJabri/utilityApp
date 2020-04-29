import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase'
import 'firebase/firestore'

Vue.use(firestorePlugin)


var config = {
  apiKey: 'AIzaSyADqYX3u-yqHpS-jpln8vMtIv-NZYVBx1o',
  authDomain: 'bills-1234.firebaseapp.com',
  databaseURL: 'https://bills-1234.firebaseio.com',
  projectId: 'bills-1234',
  storageBucket: 'bills-1234.appspot.com',
  messagingSenderId: '693484721282'
}

firebase.initializeApp(config)
export const db = firebase.firestore()

