<template>
  <q-page style="max-width: 600px; width: 90%;  margin: 0 auto;" padding>
  
         <q-banner class="bg-black text-white text-center">
       <div class="text-h5 text-weight-bold" style="letter-spacing: 2px; text-transform: uppercase;">
          Property Details
       </div>
     </q-banner>
    <q-list class="bg-grey-2" style="padding:10px 10px 20px 10px;">
      <q-form ref="propertyForm" @submit.prevent.stop="saveProperty()">
        <q-item>
          <q-input
            style="width:100%; text-transform: capitalize"
            outlined
            hint="Property Name"
            type="text"
            :rules="[ 
              val => !!val || '* Required',
              val => val.length >= 3 || 'Please use minimum 3 characters',
              val => val.length <= 20 || 'Please use maximum 16 characters',
              val=> checkProperty(val) || 'Name already in use'
          ]"
            v-model="propertyName"
          >
            <template v-slot:before>
              <q-icon name="home" style="font-size: 2rem; color: black;"></q-icon>
            </template>
          </q-input>
        </q-item>
        <br />
        <q-item>
          <q-input
            style="width:100%; text-transform: capitalize"
            outlined
            type="text"
            hint="Property Address"
            :rules="[ 
              val => !!val || '* Required',
              val => val.length >= 3 || 'Please use minimum 3 characters',
              val => val.length <= 20 || 'Please use maximum 20 characters',
          ]"
            v-model="propertyAddress"
          >
            <template v-slot:before>
              <q-icon name="mail" style="font-size: 2rem; color: black;"></q-icon>
            </template>
          </q-input>
        </q-item>
        <br>
        <q-item class="row justify-around">
          <q-btn
            @click="addUnit = true"
            style="word-spacing: 3px;letter-spacing: 1px;"
            label="add unit"
            color="primary"
          ></q-btn>
          <q-btn
            @click="addWater = true"
            style="word-spacing: 3px;letter-spacing: 1px;"
            label="add water connection"
            color="secondary"
          ></q-btn>
        </q-item>
        <br />
        <q-list :v-if="units.length > 0" v-for="(unit,unitIndex) in units" :key="unitIndex">
          <q-item class="row justify-between">
            <q-input
              outlined
              hint="Unit Name"
              style="width: 35%;"
              type="text"
              :readonly="true"
              v-model="unit.name"
            >
              <template v-slot:before>{{unitIndex+1}})</template>
            </q-input>
            <div class="row items-center">
              <q-icon style="margin-bottom: 18px;" name="all_inclusive"></q-icon>
            </div>
            <q-input
              outlined
              hint="Service Number"
              style="width:20%;"
              type="text"
              :readonly="true"
              v-model="unit.uscn"
            ></q-input>
             <div class="row content-center">
              <q-btn style="margin-bottom: 18px;" @click="deleteUnit(unitIndex,unit.name)" >
                <q-icon  name="delete"></q-icon>
              </q-btn>
            </div>
          </q-item>
        </q-list>
        <br />
          <q-list :v-if="water.length > 0" v-for="(water, waterIndex) in water" :key="waterIndex+'water'">
          <q-item class="row justify-between">
            <q-input
              outlined
              hint="Can Number"
              style="width: 35%;"
              type="text"
              :readonly="true"
              v-model="water.canNumber"
            >
              <template v-slot:before>{{waterIndex+1}})</template>
            </q-input>
         
             <div class="row content-center">
              <q-btn style="margin-bottom: 18px;" @click="deleteWater(waterIndex,water.canNumber)" >
                <q-icon  name="delete"></q-icon>
              </q-btn>
            </div>
          </q-item>
        </q-list>
        <br>
        <div class="row justify-around">
          <q-btn
            color="red"
            type=submit
            style="width: auto; font-size: 1rem; letter-spacing: 5px;"
          >Save Property</q-btn>
        </div>
      </q-form>
    </q-list>
    <q-dialog v-model="addUnit" @hide="onDialogHide">
      <q-list style="width: 80%" class="bg-white">
        <q-banner class="bg-black text-white text-center">
       <div class="text-h5 text-weight-bold" style="letter-spacing: 2px; text-transform: uppercase;">
          Unit Details
       </div>
     </q-banner>
        <br />
        <q-form ref="unitForm" @submit.prevent.stop="saveUnit(unitName,unitUscn, tenantName)">
          <q-item>
            <q-input
              outlined
              hint="Unit Name"
              style="width:100%;"
              type="text"
              :rules="[ 
                val => !!val || '* Required',
                val => val.length >= 3 || 'Please use minimum 3 characters',
                val => val.length <= 20 || 'Please use maximum 20 characters',
                val => !this.units.some(unit => unit.name === val) || 'Name already in use'
              ]"
              v-model="unitName"
            ></q-input>
          </q-item>
          <q-item>
            <q-input
              outlined
              mask="#########"
              hint="Unique Service Number"
              style="width:100%;"
              type="text"
              :rules="[ 
                val => !!val || '* Required',
                val => val.length == 9 || 'Please enter 9 digits Unique Service Number',
                val => !this.units.some(unit => unit.uscn === val) || 'Service Number already in use'
              ]"
              v-model="unitUscn"
            ></q-input>
          </q-item>       <q-item>
            <q-input
              outlined
              hint="Tenant Name (optional)"
              style="width:100%;"
              type="text"
              v-model="tenantName"
            ></q-input>
          </q-item>
          
          <br />
          <q-item class="row justify-center">
            <q-btn label="Save unit" type="submit" color="positive"></q-btn>
          </q-item>
          <br />
        </q-form>
      </q-list>
    </q-dialog>
     <q-dialog v-model="addWater" @hide="onDialogHide">
      <q-list style="width: 80%" class="bg-white">
        <q-banner class="bg-black text-white text-center">
       <div class="text-h5 text-weight-bold" style="letter-spacing: 1px; word-spacing: 3px; text-transform: uppercase;">
          WATER CONNECTION DETAILS
       </div>
     </q-banner>
        <br />
        <q-form ref="waterForm" @submit.prevent.stop="saveWater(canNumber)">
          <q-item>
            <q-input
              outlined
              mask="#########"
              hint="Can Number"
              style="width:100%;"
              type="text"
              :rules="[ 
                val => !!val || '* Required',
                val => val.length == 9 || 'Please enter 9 digits Can Number'
              ]"
              v-model="canNumber"
            ></q-input>
          </q-item>   
          <br />
          <q-item class="row justify-center">
            <q-btn label="add can number" type="submit" color="positive"></q-btn>
          </q-item>
          <br />
        </q-form>
      </q-list>
    </q-dialog>
  </q-page>
</template>

<script>
import {db} from '../db'

export default {
  data() {
    return {
      user: '',
      uscn: "",
      serviceno: "",
      propertyAddress: "",
      propertyName: "",
      units: [],
      water: [],
      canNumber: '',
      unitName: "",
      unitUscn: "",
      tenantName: '',
      addUnit: false,
      addWater: false,
      deleteDialog: false,
      propertyNames:[]
    };
  },
  created () {
    this.user = this.$q.localStorage.getItem('user')
    db.collection(`utility_manager/${this.user}/properties`).get().then(allProperties => {
      allProperties.docs.forEach(property => {
        this.propertyNames.push({name: property.data().name, address: property.data().address})
      })
    })
    },
  methods: {
    saveUnit(unitName, unitUscn, tenantName) {
          this.units.push({ name: unitName, uscn: unitUscn, tenantName: tenantName })
          this.addUnit = false
    },
    saveWater(canNumber) {
      this.water.push({ canNumber: canNumber })
      this.addWater = false
    },
    checkProperty(name){
      let output = this.propertyNames.some(item => item.name === name.toLowerCase())
      return !output
    },
    async saveProperty() {
      this.$q.loading.show()
      let p =  db.collection(`utility_manager/${this.user}/properties`)
        p.add({
          name: this.propertyName.toLowerCase().trim(),
          address: this.propertyAddress.toLowerCase().trim(),
          userId: this.user
        }).then(property => {
          let addUnits = db.collection(`utility_manager/${this.user}/properties/${property.id}/units`)
          let addWater = db.collection(`utility_manager/${this.user}/properties/${property.id}/water`)
          this.units.forEach(unit => {
            addUnits.add({
              unitName: unit.name.toLowerCase().trim(),
              uscn: unit.uscn.toLowerCase().trim(),
              tenantName: unit.tenantName.toLowerCase().trim(),
              userId: `${this.user}`,
              propertyId: property.id,
              propertyName: property.name,
              propertyAddress: property.address
            }).then( unitId => {
              addUnits.doc(unitId.id).update({unitId: unitId.id})
              this.$q.loading.hide()
            })
            .catch(err => {
              this.$q.loading.hide()
              this.$q.notify({message: err, type: 'negative'})
            })
          })
          this.water.forEach(water => {
            addWater.add({
              canNumber: water.canNumber.trim(),
              userId: `${this.user}`,
              propertyId: property.id
            }).then( waterId => {
              addWater.doc(waterId.id).update({
                waterId: unitId.id
              })
              this.$q.loading.hide()
            })
            .catch(err => {
              this.$q.loading.hide()
              this.$q.notify({message: err, type: 'negative'})
            })
          })
        }).then(success => {
          this.$q.dialog({message: `${this.propertyName} added successfully`, color: 'blue', persistent: true})
          this.$router.replace('/properties')
        })
        .catch(error => {
          this.$q.notify({message:error})
        })

    },
   
    deleteUnit(index,name) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Would you like to delete ${name.toUpperCase()}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.units.splice(index, 1);
      })
    },
     deleteWater(index,canNumber) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Would you like to delete ${canNumber}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.water.splice(index, 1);
      })
    },
    onDialogHide() {
        this.unitName = ''
        this.unitUscn = ''
        this.tenantName = ''
        this.canNumber = ''
    }
  }
};
</script>
