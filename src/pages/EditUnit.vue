<template>
  <q-page class="row justify-center q-py-md">
      <q-list class="col-xs-10 col-sm-8 col-md-5 col-lg-4 bg-grey-3 fixed-center">
        <q-banner class="bg-black text-white text-center">
          <div
            class="text-h5 text-weight-bold text-uppercase"
            style="letter-spacing: 6px;"
          >Unit Details</div>
        </q-banner>
        <br />
        <q-form ref="unitForm" @submit.prevent.stop="saveUnit()">
          <q-item>
            <q-input
              outlined
              focus
              class="full-width text-capitalize text-h6"
              hint="Unit Name"
              type="text"
              :rules="[ 
                value => !!value || '* Required',
                value => value.length >= 3 || 'Please use minimum 3 characters',
                value => value.length <= 20 || 'Please use maximum 16 characters',
                value => this.checkName(value) || 'Name already in use'
              ]"
              v-model="unit.unitName"
            ></q-input>
          </q-item>
          <q-item>
            <q-input
              outlined
              class="full-width text-capitalize text-h6"
              mask="#########"
              hint="Unique Service Number"
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
              class="full-width text-capitalize text-h6"
              hint="Tenant Name (optional)"
              type="text"
              v-model="unit.tenantName"
            ></q-input>
          </q-item>
          <q-item>
            <q-input
              outlined
              class="full-width text-capitalize text-h6"
              :readonly="true"
              hint="Property Name"
              type="text"
              v-model="unit.propertyName"
            ></q-input>
          </q-item>
          <br />
          <q-item class="row justify-around">
            <q-btn label="Save unit" type="submit" color="positive"></q-btn>
            <q-btn label="Delete unit" color="negative" @click="deleteUnit()"></q-btn>
          </q-item>
          <br />
        </q-form>
      </q-list>
  </q-page>
</template>

<script>
import { db } from "../db";

export default {
  props: ['unitId', 'propertyId'],
  data() {
    return {
      user: "",
      unit: {}, 
      unitNames: [],
      unitUscns: [],
      tenantName: "",
      tempUnitName: '',
      tempUnitUscn: '',
      unitRef: ''
    };
  },
  created() {
    this.$q.loading.show()
    this.user = this.$q.localStorage.getItem("user");
    this.unitRef = db.doc(`utility_manager/${this.user}/properties/${this.propertyId}/units/${this.unitId}`)
    this.unitRef.get()
      .then(unit => {
        this.unit= unit.data()
        this.tempUnitName = unit.data().unitName
        this.tempUnitUscn = unit.data().uscn
      }).catch(err => {
        this.$q.loading.hide()
        this.$q.notify('Please select unit to display details')
        this.$router.replace('/units')
      })
    let allUnits = db.collection(`utility_manager/${this.user}/properties/${this.propertyId}/units`).get()
    allUnits.then(snapshot => {
      snapshot.forEach(unit => {
      this.unitNames.push(unit.data().unitName)
      this.unitUscns.push(unit.data().uscn)
      this.$q.loading.hide()
      })
    }).catch(err => {
        this.$q.loading.hide()
        this.$q.notify(err)
        console.log(err)
      })

  },
  methods: {
    saveUnit() {
      console.log('SAVE STARTED......')
      this.$q.loading.show()
      this.unitRef.update({unitName: this.unit.unitName,uscn: this.unit.uscn,tenantName: this.unit.tenantName}).then(success => {
        this.$q.notify(`${this.unit.unitName} updated successfully`)
        this.$q.loading.hide()
        this.$router.replace('/units')
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
    },
    deleteUnit() {
      this.$q
        .dialog({
          title: "Confirm",
          message: `Would you like to delete ${this.unit.unitName.toUpperCase()}`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show()
          this.unitRef.delete().then(success => {
            this.$q.notify(`${this.unit.unitName.toUpperCase()} deleted succesfully`)
            this.$q.loading.hide()
            this.$router.replace('/units')
          }).catch(err => {
            this.$q.loading.hide()
            this.$q.notify(err.message)
          })
        });
    }
  }
};
</script>
