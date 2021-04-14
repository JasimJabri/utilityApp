<template>
  <q-page padding>

      <div v-if="properties.length == 0">
    <div style="min-height: 10vh; text-align: center; font-size: 1.2em;" class="row wrap justify-center items-center content-center">
        No properties listed.<br> Please add new property by clicking on the '+' sign, located at the top right hand corner of this screen.
      </div>
    </div>
    <div class="row justify-around" style="min-height: 400px; ">
      <q-card
        @click.native="viewProperty(property)"
        v-for="(property,index) in properties"
        v-bind:key="index"
        squared
        inline
        style="max-width: 800px; max-height: 150px; min-width:300px; cursor:pointer; margin: 20px; "
        class="bg-yellow-1 text-tertiary"
      >
        <q-card-section
          style="text-align: center; background: black;color: white;font-weight: 800; text-transform: uppercase;letter-spacing: 2px; word-spacing: 3px; font-size: 20px;"
        >{{ property.name }}</q-card-section>
        <q-separator />
        <q-card-section class="row justify-around">
          <q-chip detail square icon="home" class="bg-info text-brown-10">{{property.units.length}}</q-chip>
          <q-chip
            detail
            square
            icon="opacity"
            class="bg-light-blue text-black"
          >{{property.water.length}}</q-chip>
          <q-chip
            detail
            square
            icon="offline_bolt"
            class="bg-negative text-orange-2"
          >{{property.units.length}}</q-chip>
        </q-card-section>
      </q-card>

      <q-dialog
        v-model="viewPropertyDialog"
        persistent
        transition-show="slide-up"
        transition-hide="slide-down"
        @hide="onDialogHide()"
      >

        <q-list
          class="bg-grey-2 full-width"
        >
      <q-form>
          <q-item
            class="bg-black text-white rounded-borders text-h5 text-weight-bold text-uppercase text-center"
            style="margin: 2px; letter-spacing: 6px;"
          >
            <q-item-section>{{selectedProperty.name}}</q-item-section>
            <div @click="saveProperty($event.srcElement.innerText, selectedProperty)">
              <q-btn outline :color="readOnly ? 'red' : 'green'">{{readOnly ? 'edit' : 'save'}}</q-btn>
            </div>
          </q-item>
          <br />
      <q-item>
          <q-input
            style="width:100%; text-transform: capitalize"
            outlined
            hint="Property Name"
            type="text"
            :readonly="readOnly"
            :rules="[ 
              val => !!val || '* Required',
              val => val.length >= 3 || 'Please use minimum 3 characters',
              val => val.length <= 16 || 'Please use maximum 16 characters',
              val=> checkProperty(val) || 'Name already in use'
          ]"
            v-model="selectedProperty.name"
          >
            <template v-slot:before>
              <q-icon name="home" style="font-size: 2rem; color: black;"></q-icon>
            </template>
          </q-input>
        </q-item>
          <q-item>
            <q-input
              style="width:100%;  text-transform: capitalize;"
              outlined
              hint="Address"
              type="text"
              v-model="selectedProperty.address"
              :readonly="readOnly"
            >
              <template v-slot:before>
                <q-icon name="home" style="font-size: 2rem; color: black;"></q-icon>
              </template>
            </q-input>
          </q-item>

          <br />
          <q-table
            hide-title
            :data="selectedProperty.units"
            :columns="columns"
            row-key="name"
            hide-bottom
            class="unit_table"
            style="text-transform: capitalize;"
          />
          <br />
          <q-item class="row justify-around">
            <q-btn color="negative" @click="deleteProperty()" label="Delete" />
            <q-btn
              color="primary"
              @click="viewPropertyDialog = !viewPropertyDialog"
              label="Cancel"
            />
          </q-item>
      </q-form>
        </q-list>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { db } from "../db.js";
import { async } from "q";

export default {
  data() {
    return {
      viewPropertyDialog: false,
      properties: [],
      units: [],
      user: "",
      selectedProperty: [],
      tempPropertyName: '',
      readOnly: true,
      propertyNames: [],
      columns: [
        {
          name: "desc",
          required: true,
          label: "Unit Name",
          align: "left",
          field: "unitName",
          sortable: true,
          classes: "my-class"
        },
        {
          name: "uscn",
          required: true,
          label: "Unique Service No.",
          align: "left",
          field: "uscn",
          sortable: true,
          classes: "my-class"
        }
      ]
    };
  },
  created() {
    this.onInit();
  },
  methods: {
    async onInit() {
      this.$q.loading.show();
      this.properties.length = 0;
      this.user = this.$q.localStorage.getItem("user");
      let allProperties = await db
        .collection(`utility_manager/${this.user}/properties`)
        .get();
      allProperties.docs.map(property => {
        let tempUnit = [],
          tempWater = [];
        let unit = db
          .collection(
            `utility_manager/${this.user}/properties/${property.id}/units`
          )
          .get();
        unit.then(snapshot => {
          snapshot.forEach(unit => {
            tempUnit.push(unit.data());
          });
        });
        let water = db
          .collection(
            `utility_manager/${this.user}/properties/${property.id}/water`
          )
          .get();
        water.then(snapshot => {
          snapshot.forEach(unit => {
            tempWater.push(unit.data());
          });
        });
        this.properties.push({
          name: property.data().name,
          propertyId: property.id,
          address: property.data().address,
          units: tempUnit,
          water: tempWater
        });
        this.propertyNames.push({
            name: property.data().name,
          })
      });
      this.$q.loading.hide();
    },
    checkProperty(name) {
      name=name.trim()
      if (name.toLowerCase() == this.tempPropertyName.toLowerCase()) {
          return true
      }
      else {
        let output = this.propertyNames.some(item => item.name.toLowerCase() === name.toLowerCase());
        return !output;
      }
    },
    viewProperty(property) {
      this.viewPropertyDialog = true;
      this.selectedProperty = property;
      this.tempPropertyName = property.name;
    },
    saveProperty(val, selectedProperty) {
      if (val === "EDIT") {
        this.readOnly = false;
      } else if (val === "SAVE") {
        this.$q.loading.show();
        let p = db
          .collection(`utility_manager/${this.user}/properties`)
          .doc(this.selectedProperty.propertyId)
          .update({
            name: this.selectedProperty.name.toLowerCase(),
            address: this.selectedProperty.address.toLowerCase()
          })
          .then(success => {
            this.$q.notify({
              message: `${this.selectedProperty.name} successfully updated`
            });
            this.onInit();
            this.viewPropertyDialog = false;
            this.$q.loading.hide();
          })
          .catch(err => {
            console.log(err);
            this.$q.loading.hide();
          });
      }
    },
    async deleteProperty() {
      let unitsPath = `utility_manager/${this.user}/properties/${this.selectedProperty.propertyId}/units`;
      this.$q
        .dialog({
          title: "Confirm",
          message: `Would you like to delete ${this.selectedProperty.name.toUpperCase()}?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show();
          this.deleteAll();
        });
    },
    onDialogHide() {
      this.readOnly = true;
      this.selectedProperty = [];
    },
    async deleteAll() {
      let unitsPath = `utility_manager/${this.user}/properties/${this.selectedProperty.propertyId}/units`;
      let waterPath = `utility_manager/${this.user}/properties/${this.selectedProperty.propertyId}/water`;

      await this.deleteCollection(db, unitsPath, 5);
      await this.deleteCollection(db, waterPath, 5);
      db.collection(`utility_manager/${this.user}/properties`)
        .doc(this.selectedProperty.propertyId)
        .delete()
        .then(success => {
          this.onInit();
          this.viewPropertyDialog = false;
          this.$q.loading.hide();
          this.$q.notify({
            message: `${this.selectedProperty.name.toUpperCase()} deleted successfully`,
            type: "danger"
          });
        })
        .catch(err => {
          this.$q.loading.hide();
          console.log(err);
        });
    },
    deleteCollection(db, collectionPath, batchSize) {
      let collectionRef = db.collection(collectionPath);
      let query = collectionRef.orderBy("__name__").limit(batchSize);

      return new Promise((resolve, reject) => {
        this.deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    },
    deleteQueryBatch(db, query, batchSize, resolve, reject) {
      query
        .get()
        .then(snapshot => {
          // When there are no documents left, we are done
          if (snapshot.size == 0) {
            return 0;
          }

          // Delete documents in a batch
          let batch = db.batch();
          snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
          });

          return batch.commit().then(() => {
            return snapshot.size;
          });
        })
        .then(numDeleted => {
          if (numDeleted === 0) {
            resolve();
            return;
          }

          // Recurse on the next process tick, to avoid
          // exploding the stack.
          process.nextTick(() => {
            this.deleteQueryBatch(db, query, batchSize, resolve, reject);
          });
        })
        .catch(reject);
    }
  }
};
</script>

<style lang="stylus">
.unit_table {
  margin: 0 auto;
  width: 95%;
}
</style>
