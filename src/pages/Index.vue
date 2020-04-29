<template>
  <q-page class="row justify-center content-start" style="width: 100%;">
     <q-list v-for="(property,pIndex) in properties" :key="pIndex" class="bg-grey-10 text-white shadow-2 rounded-borders" style="max-width: 400px; width: 100%; margin: 15px;">
       <q-list>
          <q-item class="bg-black" style="text-align: center; font-size: 22px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
            <q-item-section>{{property.propertyName}}</q-item-section>
          </q-item>
          <q-separator dark ></q-separator>
          <q-item class="bg-grey-9" style="font-size:18px; font-weight: 400; text-align: center; letter-spacing: 3px;">
            <q-item-section>Electricity Bills</q-item-section>
          </q-item>
          <q-separator dark></q-separator>
          <q-item 
          v-ripple
           @click.native="viewUnit(unit,uIndex,pIndex)"
          v-for="(unit,uIndex) in property.units"
          v-bind:key="uIndex"
           style="font-size:18px; cursor: pointer;">
            <q-item-section avatar>
              <q-icon name="emoji_objects" ></q-icon>
            </q-item-section>
            <q-item-section style="text-transform: capitalize;">{{ unit.tenantName }}</q-item-section>
            <q-item-section style="text-align: end;">&#8377; {{unit.amount}}</q-item-section>
          </q-item>
          <q-separator dark></q-separator>
          <q-item class="bg-grey-9" style="font-size:18px; font-weight: 400; text-align: center; letter-spacing: 2px;">
            <q-item-section>Water Bills</q-item-section>
          </q-item>
          <q-separator dark></q-separator>
          <q-item v-for="(water,wIndex) in property.water" :key="'w'+wIndex" style="font-size:18px">
            <q-item-section avatar>
              <q-icon name="waves"></q-icon>
            </q-item-section>
            <q-item-section>{{water.canNumber}}</q-item-section>
            <q-item-section style="text-align: end;">&#8377; {{water.arrears}}</q-item-section>
          </q-item>
          <q-item v-if="property.water.length==0" style="text-align: center; ">
            <q-item-section>
              No data available!
            </q-item-section>
          </q-item>
       </q-list>
        </q-list>

      <q-dialog
        v-model="viewUnitModal"
        persistent
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-list class="bg-grey-2"
          style="padding: 16px 10px 20px 10px; width: 95vw; height: 95vh; max-width: 700px; max-height: 750px;"
        >
           <q-item class="bg-black text-white" style="text-align: center; font-size: 22px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase;">
            <q-item-section> {{viewUnitData.tenantName}}</q-item-section>
             <div @click="saveUnit($event.srcElement.innerText, viewUnitData)">
            <q-btn outline :color= "readOnly ? 'red' : 'green'">{{readOnly ? 'edit name' : 'save name'}}</q-btn>
          </div>
          </q-item>
        <br>
          <q-item>
            <q-input
            style="width:100%;  text-transform: capitalize;"
            standout
            hint="Tenant Name"
            type="text"
            v-model="viewUnitData.tenantName"
            :readonly="readOnly"
            >
              <template v-slot:before>
            <q-icon name="person" style="font-size: 2rem; color: black;"></q-icon>
          </template>
            </q-input>
          </q-item>
          <q-item class="row items-center justify-center" style="font-size: 1.2em;">Cannot edit following fields</q-item>
          <q-item>

          <q-input 
          style="width: 100%;  text-transform: capitalize;"
          standout
          type="text"
          :readonly="true"
          hint="Unit Name"
          v-model="viewUnitData.unitName">
          <template v-slot:before>
            <q-icon name="mail" style="font-size: 2rem; color: black;"></q-icon>
          </template>
          </q-input>
          </q-item>
          <br>
          <q-item>
           <q-input  filled hint="Unique Service Number" style="width: 100%;" type="text" :readonly=true v-model="viewUnitData.uscn">
          <template v-slot:before>
            <q-icon name="whatshot" style="font-size: 2rem; color: black;"></q-icon>
          </template>
           </q-input>
          </q-item>
          <br>
          <q-item>

            <q-input filled hint="Service Number" style="width: 100%;" type="text" :readonly=true v-model="viewUnitData.serviceno">
              <template v-slot:before>
            <q-icon name="all_inclusive" style="font-size: 2rem; color: black;"></q-icon>
          </template>
            </q-input>
          </q-item>
          <br>
             <q-item>

            <q-input filled hint="Due Date" style="width: 100%;" type="text" :readonly=true v-model="viewUnitData.dueDate">
              <template v-slot:before>
            <q-icon name="warning" style="font-size: 2rem; color: black;"></q-icon>
          </template>
            </q-input>
          </q-item>
        <br>
        <div class="row justify-around">
            <q-btn color="red" style="width: 50%; font-size: 1rem; letter-spacing: 5px;" @click="closeViewModal()">Cancel</q-btn>
        </div>
          
        </q-list>
      </q-dialog>
      <br>
  </q-page>
</template>

<script>
import {db} from '../db'
export default {
  name: 'PageIndex',
  data:  () => {
    return {
      properties: [],
      units: [],
      water: [],
      viewUnitModal: false,
      addUnitModal: false,
      readOnly: true,
      viewUnitData: {},
      addUnitData: [],
      originalUnitData: {},
      maximizedToggle: true
    }
  },
 created() {
    this.properties.length = 0
    let user = this.$q.localStorage.getItem('user')
    let isLoggedIn = this.$q.localStorage.getItem('isLoggedIn')
    let allProperties = db.collection(`utility_manager/${user}/properties`)
    allProperties.onSnapshot(properties => {
      this.properties.length = 0
      properties.forEach(property => {
        let units = db.collection(
          `utility_manager/${user}/properties/${property.id}/units`
        )
        let tempUnits = [], tempWater = []
        units.onSnapshot({ includeMetadataChanges: true }, units => {
          tempUnits.length = 0
          units.forEach(unit => {
            tempUnits.push(unit.data())
          })
        })
        let water = db.collection(
          `utility_manager/${user}/properties/${property.id}/water`
        )
        water.onSnapshot({ includeMetadataChanges: true }, water => {
          tempWater.length = 0
          water.forEach(unit => {
            tempWater.push(unit.data())
          })
        })
        this.properties.push({
          propertyName: property.data().name.toUpperCase(),
          units: tempUnits,
          water: tempWater
        })
      })
    })
  },
  methods: {
    viewUnit(unit, uIndex, pIndex) {
      console.log(unit,uIndex,pIndex)
      this.viewUnitModal = true
      this.originalUnitData = Object.assign({}, unit)
      this.originalUnitData.uIndex = uIndex
      this.originalUnitData.pIndex = pIndex
      this.viewUnitData = unit
    },
    saveUnit(val, unit) {
      console.log(unit.userId)
      if (val === 'EDIT NAME') {
        this.readOnly = false
      } else if (val === 'SAVE NAME') {
        this.$q.loading.show()
        delete unit['pIndex']
        delete unit['uIndex']
        let updateArray = Object.keys(unit)
        let obj = {}
        updateArray.map(key => {
          let val = unit[key]
          obj[key] = val
        })
        let newUnit = db
          .collection(
            `utility_manager/${unit.userId}/properties/${unit.propertyId}/units`
          )
          .doc(`${unit.unitId}`)
        newUnit
          .update(obj)
          .then(val => {
            this.viewUnitModal = false
            this.$q.notify({
              message: `${obj.tenantName} successfully updated`,
              type: 'positive'
            })
            this.readOnly = true
            this.$q.loading.hide()
          })
          .catch(err => {
            console.log(err)
            this.$q.notify({ message: 'Error Loading Data', type: 'negative' })
            this.$q.loading.hide()
          })
      }
    },
    closeViewModal() {
      this.viewUnitModal = false
      this.readOnly = true
      let pIndex = this.originalUnitData.pIndex
      let uIndex = this.originalUnitData.uIndex
      this.properties[pIndex].units[uIndex] = this.originalUnitData
    },
    modalClosed() {
      this.$q.loading.hide()
      this.readOnly = true
    }
  }
}
</script>
