import MyLayout from 'layouts/MyLayout'
import LoginLayout from 'layouts/LoginLayout'
import Index from 'pages/Index'
import Properties from 'pages/Properties'
import Units from 'pages/Units'
import AddProperty from 'pages/AddProperty'
import EditUnit from 'pages/EditUnit'
import AddUnit from 'pages/AddUnit'
import Login from 'pages/Login'
import Register from 'pages/Register'
import Water from 'pages/Water'
import AddWater from 'pages/AddWater'

const routes = [
  {
    path: '/',
    component: MyLayout,
    children: [
      { path: '', component: Index ,meta: {title: 'Bills Manager'} },
      { name: 'bills', path: '/bills', component: Index, meta: {title: 'Bills Manager'} },
      { name: 'properties', path: '/properties', component: Properties, meta: {title: 'All Properties', buttons: {icon:'add_box', path: '/addProperty'}} },
      { name: 'water', path: '/water', component: Water, meta: {title: 'Water Connections', buttons: {icon:'add_box', path: '/addWater'}} },
      { name: 'units', path: '/units', component: Units, meta: {title: 'All Units', buttons: {icon:'add_box', path: '/addUnit'}} },
      { name: 'editUnit', path: '/editUnit', props: true, component: EditUnit, meta: {title: 'Edit Unit', buttons: {label: 'Cancel', path: '/units'}} },
      { name: 'addUnit', path: '/addUnit', props: true, component: AddUnit, meta: {title: 'Add New Unit', buttons: {label: 'Cancel', path: '/units'}} },
      { name: 'addProperty', path: '/addProperty', component: AddProperty, meta: {title: 'Add New Property', buttons: {label: 'Cancel', path: '/Properties'}} },
      { name: 'addWater', path: '/addWater', component: AddWater, meta: {title: 'Add New Connection', buttons: {label: 'Cancel', path: '/Water'}} },
    ]
  },
  {
    path: '/login',
    component: LoginLayout,
    children: [
      { path: '/login', component: Login },
      { path: '/register', component: Register },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
