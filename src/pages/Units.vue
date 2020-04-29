<template>
  <div class="q-pa-md doc-container">
    <div class="row justify-center">
      <div class="col-4">
        <q-select
          outlined
          v-model="model"
          label="Please Select Property"
         :options="properties"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          @input="showProperty(model)"
        />
      </div>
    </div>
    <br>
    <br>
    <div class="row justify-center">
      <q-list v-if="model != null">
         <q-item class="row justify-between" style="width: 400px; border-color:lightgrey; border-style:solid; border-width: 2px;" >
         <div style="text-align: center; width: 300px;">Unit Name
           </div>  
         <div style="text-align: center; width: 100px;">Edit</div>  
        </q-item>
        <q-item class="row justify-between" style="width: 400px; background: lightgrey;" v-for="unit in units" v-bind:key="unit.unitId">
         <div style="text-align: center; width: 300px; text-transform: capitalize;">
           {{unit.unitName}}
           </div>
         <q-btn  style="text-align: center; width: 100px;" @click="editUnit(unit)">Edit</q-btn>  
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { db } from "../db.js";
import { async } from "q";
import { log } from 'util';
export default {
  data() {
    return {
      model: null,
      properties: [],
      units: []
    };
  },
  created() {
    this.onInit()
  },
  methods:  {
    async onInit() {
      this.$q.loading.show();
      this.properties.length = 0;
      this.user = this.$q.localStorage.getItem("user");
      let allProperties = await db
        .collection(`utility_manager/${this.user}/properties`)
        .get().catch(err => {
        this.$q.loading.hide()
        this.$q.notify(err.message)
        console.log(err.message)
      });
      allProperties.forEach(property => {
        this.properties.push({name: property.data().name.toUpperCase(), id: property.id})
      })
      this.$q.loading.hide();
    },
    async showProperty(id) {
      this.$q.loading.show();
      this.units.length = 0 
      let allUnits = await db.collection(`utility_manager/${this.user}/properties/${id}/units`).get().catch(err => {
        this.$q.loading.hide()
        this.$q.notify(err.message)
        console.log(err.message)
      })
      allUnits.forEach(doc => {
        this.units.push(doc.data())
      })
      this.$q.loading.hide()
    },
  editUnit(unit) {
    this.$q.loading.show()
    this.$router.push({name: 'editUnit', params: {unitId: unit.unitId, propertyId: unit.propertyId} });
  }
  },
};
</script>
<style lang="stylus" scoped>
.doc-container
  padding-top 50px
</style>