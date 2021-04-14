<template>
  <q-page padding class="bg-light-blue-1">
    <div class="row justify-center">

    <q-item>
      <q-btn @click="contents()" label="Array Contents"></q-btn>
    </q-item>
    <q-list
      v-for="(property, pIndex) in properties"
      :key="pIndex"
      class="bg-light-blue text-dark shadow-2 rounded-borders"
      style="max-width: 400px; width: 100%; margin: 15px;"
    >
      <div v-if="property.water.length > 0" >     
        <q-item
          class="bg-light-blue-10 text-white text-h6 text-weight-bold text-uppercase text-center"
          style="letter-spacing: 3px; word-spacing: 5px;"
        >
          <q-item-section>{{ property.propertyName }}</q-item-section>
        </q-item>
        <q-item
          v-for="(water, wIndex) in property.water"
          :key="'w' + wIndex"
          class="text-h6 text-weight-bold"
        >
          <q-item-section avatar>
            <q-icon name="waves"></q-icon>
          </q-item-section>
          <q-item-section>{{ water.canNumber }}</q-item-section>
          <q-item-section style="text-align: end;">
            &#8377; {{ water.arrears }}
          </q-item-section>
        </q-item>
        </div>
    </q-list>
  </div>
  </q-page>
</template>

<script>
import { db } from "../db";

export default {
  data() {
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
      maximizedToggle: true,
      currentDate: Date.now(),
    };
  },
  created() {
    this.properties.length = 0;
    let user = this.$q.localStorage.getItem("user");
    let isLoggedIn = this.$q.localStorage.getItem("isLoggedIn");
    let allProperties = db.collection(`utility_manager/${user}/properties`);
    allProperties.onSnapshot((properties) => {
      this.properties.length = 0;
      properties.forEach((property) => {
        let units = db.collection(
          `utility_manager/${user}/properties/${property.id}/units`
        );
        let tempUnits = [],
          tempWater = [];
        units.onSnapshot({ includeMetadataChanges: true }, (units) => {
          tempUnits.length = 0;
          units.forEach((unit) => {
            tempUnits.push(unit.data());
          });
        });
        let water = db.collection(
          `utility_manager/${user}/properties/${property.id}/water`
        );
        water.onSnapshot({ includeMetadataChanges: true }, (water) => {
          tempWater.length = 0;
          water.forEach((unit) => {
            tempWater.push(unit.data());
          });
        });
        this.properties.push({
          propertyName: property.data().name.toUpperCase(),
          units: tempUnits,
          water: tempWater,
        });
      });
    });
  },
  methods: {
    contents() {
      console.log(this.properties);
    },
  },
};
</script>
