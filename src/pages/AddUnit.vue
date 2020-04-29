<template>
  <q-page style="max-width: 600px; width: 90%;  margin: 0 auto;" padding>
    <div class="row justify-center">
      <div class="col-4">
        <q-select
          v-if="!showUnit"
          outlined
          v-model="model"
          label="Please Select Property"
         :options="properties"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          @input="addUnit(model)"
        />
      </div>
    </div>
      <q-list v-if="showUnit" style="width: 80%" class="bg-white">
        <q-banner class="bg-black text-white text-center">
          <div
            class="text-h5 text-weight-bold"
            style="letter-spacing: 2px; text-transform: uppercase;"
          >Unit Details</div>
        </q-banner>
        <br />
        <q-form ref="unitForm" @submit.prevent.stop="saveUnit()">
          <q-item>
            <q-input
              outlined
              hint="Unit Name"
              style="width:100%; text-transform: capitalize;"
              type="text"
              :rules="[ 
                val => !!val || '* Required',
                val => val.length >= 3 || 'Please use minimum 3 characters',
                val => val.length <= 20 || 'Please use maximum 16 characters',
                val => this.checkName(val) || 'Name already in use'
              ]"
              v-model="unit.unitName"
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
                val => this.checkUscn(val) || 'Service Number already in use'
              ]"
              v-model="unit.uscn"
            ></q-input>
          </q-item>
          <q-item>
            <q-input
              outlined
              hint="Tenant Name (optional)"
              style="width:100%; text-transform: capitalize"
              type="text"
              v-model="unit.tenantName"
            ></q-input>
          </q-item>
          <q-item>
            <q-input
              outlined
              :readonly="true"
              hint="Property Name"
              style="width:100%; text-transform: capitalize;"
              type="text"
              v-model="unit.propertyName"
            ></q-input>
          </q-item>
          <br />
          <q-item class="row justify-center">
            <q-btn label="Save unit" type="submit" color="positive"></q-btn>
          </q-item>
          <br />
        </q-form>
      </q-list>
  </q-page>
</template>

<script>
import { db } from "../db";

export default {
  data() {
    return {
      model: null,
      properties: [],
      units: [],
      user: "",
      unit: {}, 
      unitNames: [],
      unitUscns: [],
      tenantName: "",
      tempUnitName: '',
      tempUnitUscn: '',
      showUnit: false
    };
  },
  created() {
    this.onInit()
  },
  methods: {
    async onInit() {
      this.$q.loading.show()
      this.properties.length = 0
      this.user = this.$q.localStorage.getItem("user")
      let allProperties = await db
        .collection(`utility_manager/${this.user}/properties`)
        .get().catch(err => {
        this.$q.loading.hide()
        this.$q.notify(err.message)
        console.log(err.message)
      });
      allProperties.forEach(property => {
        this.properties.push({name: property.data().name.toUpperCase(), id: property.id })
      })
      this.$q.loading.hide()
    },
    async addUnit(id) {

      this.$q.loading.show()
      this.units.length = 0
      let propertySelected = this.properties.find(item => item.id == id)
      let allUnits = await db.collection(`utility_manager/${this.user}/properties/${id}/units`).get().catch(err => {
        this.$q.loading.hide()
        this.$q.notify(err.message)
        console.log(err.message)
      })
      allUnits.forEach(doc => {
        this.units.push(doc.data())
      })
      this.unit.propertyName = propertySelected.name
      this.unit.propertyId = id
      this.unit.userId = this.user
      this.showUnit = true
      this.$q.loading.hide()
    },
    saveUnit() {
      console.log(this.unit)
      this.$q.loading.show()
      let p = db.collection(`utility_manager/${this.user}/properties/${this.unit.propertyId}/units`)
      p.add({
          unitName: this.unit.unitName,
          uscn: this.unit.uscn,
          tenantName: this.unit.tenantName,
          propertyId: this.unit.propertyId,
          propertyName: this.unit.propertyName,
          userId: this.user
        }).then(unit => {
        p.doc(unit.id).update({unitId: unit.id})
        }).then(success => {
          this.$router.replace('/units')
          this.$q.notify(`${this.unit.unitName.toUpperCase()} added successfully`)
          this.$q.loading.hide()
      }).catch(err => {
        this.$q.loading.hide()
        console.log(err)
        
        })
    },
    checkName(name) {
      if (name == this.tempUnitName) {
          return true
      }
      else {
        let output = this.unitNames.some(item => item.toLowerCase().trim() === name.toLowerCase().trim())
        return !output;
      }
    },
    checkUscn(uscn) {
      if (uscn == this.tempUnitUscn) {
          return true
      }
      else {
        let output = this.unitUscns.some(item => item.toString().trim() == uscn.trim())
        return !output;
      }
    }
  }
};
</script>
