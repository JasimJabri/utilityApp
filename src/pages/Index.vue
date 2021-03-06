<template>
  <q-page class="row justify-center content-start" style="width: 100%;">
    <q-list
      v-for="(property, pIndex) in properties"
      :key="pIndex"
      class="bg-grey-10 text-white shadow-2 rounded-borders"
      style="max-width: 400px; width: 100%; margin: 15px;"
    >
      <q-list>
        <q-item
          class="bg-black text-h5 text-weight-bold text-center"
          style="letter-spacing: 3px;"
        >
          <q-item-section>{{ property.propertyName }}</q-item-section>
        </q-item>
        <q-separator dark></q-separator>
        <q-item
          class="bg-grey-9"
          style="font-size:18px; font-weight: 500; text-align: center; letter-spacing: 3px;"
        >
          <q-item-section>Electricity Bills</q-item-section>
        </q-item>
        <q-separator dark></q-separator>
        <q-item
          v-ripple
          @click.native="viewUnit(unit, uIndex, pIndex)"
          v-for="(unit, uIndex) in property.units"
          v-bind:key="uIndex"
          class="text-h6"
          style="cursor: pointer; "
        >
          <q-item-section avatar>
            <q-icon name="emoji_objects"></q-icon>
          </q-item-section>
          <q-item-section style="text-transform: capitalize;">{{
            unit.tenantName
          }}</q-item-section>
          <q-item-section style="text-align: end;"
            >&#8377; {{ unit.amount }}</q-item-section
          >
        </q-item>
        <q-separator dark></q-separator>
        <q-item
          class="bg-grey-9"
          style="font-size:18px; font-weight: 500; text-align: center; letter-spacing: 2px;"
        >
          <q-item-section>Water Bills</q-item-section>
        </q-item>
        <q-separator dark></q-separator>
        <q-item
          v-for="(water, wIndex) in property.water"
          :key="'w' + wIndex"
          class="text-h6"
        >
          <q-item-section avatar>
            <q-icon name="waves"></q-icon>
          </q-item-section>
          <q-item-section>{{ water.canNumber }}</q-item-section>
          <q-item-section style="text-align: end;"
            >&#8377; {{ water.arrears }}</q-item-section
          >
        </q-item>
        <q-item v-if="property.water.length == 0" style="text-align: center; ">
          <q-item-section>
            No data available!
          </q-item-section>
        </q-item>
      </q-list>
    </q-list>

    <q-dialog
      @click="currentDate=Date.now()"
      v-model="viewUnitModal"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-list
        class="bg-grey-1"
        style="padding: 2px; width: 95vw; height: 95vh; max-width: 440px; max-height: 800px;"
      >
        <q-item
          class="bg-black text-white rounded-borders q-mb-md"
          style="text-align: center; font-size: 22px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase;"
        >
          <q-item-section> {{ viewUnitData.tenantName }}</q-item-section>
          <div @click="saveUnit($event.srcElement.innerText, viewUnitData)">
            <q-btn outline :color="readOnly ? 'red' : 'green'">{{
              readOnly ? "edit name" : "save name"
            }}</q-btn>
          </div>
        </q-item>
        <q-item>
          <q-input
            filled
            style="width:100%;  text-transform: capitalize;"
            standout
            hint="Tenant Name"
            type="text"
            v-model="viewUnitData.tenantName"
            :readonly="readOnly"
          >
            <template v-slot:before>
              <q-icon
                name="perm_identity"
                style="font-size: 2rem; color: black;"
              ></q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item>
          <q-input
            filled
            class= "full-width"
            style="text-transform: capitalize;"
            standout
            type="text"
            :readonly="true"
            hint="Unit Name"
            v-model="viewUnitData.unitName"
          >
            <template v-slot:before>
              <q-icon
                name="home"
                style="font-size: 2rem; color: black;"
              ></q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item>
          <q-input
            filled
            class="full-width text-capitalize"
            hint="service meter owner name"
            type="text"
            :readonly="true"
            v-model="viewUnitData.servicename"
          >
            <template v-slot:before>
              <q-icon
                name="person"
                style="font-size: 2rem; color: black;"
              ></q-icon>
            </template>
          </q-input>
        </q-item>

        <div class="row flex">
          <q-item class="col-6">
            <q-input
              filled
              hint="Due Date"
              type="text"
              :readonly="true"
              v-model="viewUnitData.dueDate"
            >
              <template v-slot:before>
                <q-icon
                  name="event_available"
                  style="font-size: 2rem; color: black;"
                ></q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item class="col-6">
            <q-input
              filled
              hint="Bill Date"
              type="text"
              :readonly="true"
              v-model="viewUnitData.billDate"
            >
            </q-input>
          </q-item>
        </div>
        <div class="row flex">
          <q-item class="col-6">
            <q-input
              filled
              hint="Service Number"
              type="text"
              :readonly="true"
              v-model="viewUnitData.serviceno"
            >
              <template v-slot:before>
                <q-icon
                  name="tag"
                  style="font-size: 2rem; color: black;"
                ></q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item class="col-6">
            <q-input
              filled
              hint="Unique Service Number"
              type="text"
              :readonly="true"
              v-model="viewUnitData.uscn"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="content_copy"
                  @click="clipboard(viewUnitData.uscn)"
                />
              </template>
            </q-input>
          </q-item>
        </div>
        <div class="row flex">
          <q-item class="col-6">
            <q-input
              filled
              hint="Amount"
              type="text"
              :readonly="true"
              v-model="viewUnitData.amount"
            >
              <template v-slot:before>
                <q-icon
                  style="font-size: 2rem; color: black;"
                >
                 <img style="height: 22px; width: 22px;" src="~assets/rupee-indian.svg" />
                </q-icon>
              </template>
            </q-input>
          </q-item>

          <q-item class="col-6">
            <q-input
              filled
              hint="Electricity Revenue Office"
              type="text"
              :readonly="true"
              v-model="viewUnitData.ero"
            >
            </q-input>
          </q-item>
        </div>
        <q-item>
          <q-input
            filled
            class="full-width"
            hint="Last Updated"
            type="text"
            :readonly="true"
            :value="timeDiffCalc(viewUnitData.lastUpdated, currentDate)"
          >
            <template v-slot:before>
              <q-icon
                name="update"
                style="font-size: 2rem; color: black;"
              ></q-icon>
            </template>
          </q-input>
        </q-item>

        <q-item class="flex justify-center q-pt-md">
          <q-btn
            class="q-px-lg"
            color="red"
            style="font-size: 1rem; letter-spacing: 7px;"
            @click="closeViewModal()"
            >Cancel</q-btn
          >
        </q-item>
      </q-list>
    </q-dialog>
  </q-page>
</template>

<script>
import { db } from "../db";
import { copyToClipboard } from "quasar";

export default {
  name: "PageIndex",
  data: () => {
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
      currentDate: Date,
    };
  },
  created() {
    this.currentDate = Date.now()
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
    viewUnit(unit, uIndex, pIndex) {
      console.log(unit, uIndex, pIndex);
      this.viewUnitModal = true;
      this.originalUnitData = Object.assign({}, unit);
      this.originalUnitData.uIndex = uIndex;
      this.originalUnitData.pIndex = pIndex;
      this.viewUnitData = unit;
    },
    saveUnit(val, unit) {
      // console.log(unit.userId);
      if (val === "EDIT NAME") {
        this.readOnly = false;
      } else if (val === "SAVE NAME") {
        this.$q.loading.show();
        delete unit["pIndex"];
        delete unit["uIndex"];
        let updateArray = Object.keys(unit);
        let obj = {};
        updateArray.map((key) => {
          let val = unit[key];
          obj[key] = val;
        });
        let newUnit = db
          .collection(
            `utility_manager/${unit.userId}/properties/${unit.propertyId}/units`
          )
          .doc(`${unit.unitId}`);
        newUnit
          .update(obj)
          .then((val) => {
            this.viewUnitModal = false;
            this.$q.notify({
              message: `${obj.tenantName} successfully updated`,
              type: "positive",
            });
            this.readOnly = true;
            this.$q.loading.hide();
          })
          .catch((err) => {
            console.log(err);
            this.$q.notify({ message: "Error Loading Data", type: "negative" });
            this.$q.loading.hide();
          });
      }
    },
    closeViewModal() {
      this.viewUnitModal = false;
      this.readOnly = true;
      let pIndex = this.originalUnitData.pIndex;
      let uIndex = this.originalUnitData.uIndex;
      this.properties[pIndex].units[uIndex] = this.originalUnitData;
    },
    modalClosed() {
      this.$q.loading.hide();
      this.readOnly = true;
    },
    clipboard(uscn) {
      copyToClipboard(uscn)
        .then(() => {
          this.$q.notify({
            message: `${uscn} copied to clipboard`,
            type: "positive",
          });
        })
        .catch(() => {
          console.log("Error");
        });
    },
    timeDiffCalc(datePast, dateNow) {
      let diffInMilliSeconds = Math.abs(datePast - dateNow) / 1000;

      // calculate days
      const days = Math.floor(diffInMilliSeconds / 86400);
      diffInMilliSeconds -= days * 86400;

      // calculate hours
      const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
      diffInMilliSeconds -= hours * 3600;

      // calculate minutes
      const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
      diffInMilliSeconds -= minutes * 60;

      let difference = "";
      if (days > 0) {
        difference += days === 1 ? `${days} day, ` : `${days} days, `;
      }
      if (hours > 0) {
        difference += hours === 1 ? `${hours} hour, ` : `${hours} hours, `;
      }
      difference +=
        minutes === 0 || hours === 1
          ? `${minutes} minutes`
          : `${minutes} minutes`;

      difference += " ago";
      return difference;
    },
  },
};
</script>
