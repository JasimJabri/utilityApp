<template>
  <div class="q-pa-md doc-container">
    <div class="row justify-center">
      <div class="col-xs-11 col-sm-8 col-md-4 col-lg-3 bg-grey-3">
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
      <q-list v-if="model != null"
        class="col-xs-11 col-sm-8 col-md-4 col-lg-3 bg-grey-10 rounded-borders"
      >
         <q-item class="row flex justify-start text-uppercase text-white text-h6"  >
         <div class="col-8">Unit Name
           </div>  
          
         <div class="col-4 flex justify-center">Edit</div>  
        </q-item>
        <q-item class="row bg-grey-3" v-for="unit in units" v-bind:key="unit.unitId">
         <div class="flex items-center justify-start col-8 text-capitalize text-h6">
           {{unit.unitName}}
           </div>
         <q-btn class="col-4" color="primary" label="edit" @click="editUnit(unit)"></q-btn>  
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