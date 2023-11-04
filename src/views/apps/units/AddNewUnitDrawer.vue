<script setup>
import { refreshUserLogin } from '@/common/reusing_functions'
import axios from '@axios'
import {
requiredValidator,
} from '@validators'
import { watchEffect } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])

const singleUnitsCheck = ref(false)
const multipleUnitsCheck = ref(false)
const isFormValid = ref(false)
const refForm = ref()
const unitName = ref()
const unitType = ref()
const unitRent = ref()
const unitBedrooms = ref()
const unitBathrooms = ref()
const unitStatus = ref()
const unitProperty = ref()
const unitSize = ref()
const unitFloor = ref()
const floorList = ref([])
const unitDrawerAlert = ref({ show: false, message: null, color: null })
const isInputEnabled = ref(false)
const role = ref()
const plan = ref()
const status = ref()

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onUnitFormSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {


      if(!sessionStorage.getItem("accessToken")){
        router.push('/login')

        return 
      }
      let sendData = {
        "userId": sessionStorage.getItem("userId"),
        "propertyId": unitProperty.value,
        "unitsData": {
          "Unit Name/Number": unitName.value,
          "Unit Type": unitType.value,
          "Unit Rent": unitRent.value,
          "Unit Bedrooms": unitBedrooms.value,
          "Unit Bathrooms": unitBathrooms.value,
          "Unit Size": unitSize.value,
          "Status": unitStatus.value,
          "Unit Floor": unitFloor.value,
        }, 
      }

      axios({
        url: "http://localhost:8000/prop-app/units/add",
        method: 'POST',
        data: sendData,
        headers: {
          'Authorization': sessionStorage.getItem("accessToken"),
        },
      }).then(response => {
        unitDrawerAlert.value.message = response.data.message
        unitDrawerAlert.value.color = "success"
        unitDrawerAlert.value.show = true
        emit('update:isDrawerOpen', false)
        refForm.value?.reset()
      }).catch(error => {
        unitDrawerAlert.value.message = error.response.data.message
        unitDrawerAlert.value.color = "error"
        unitDrawerAlert.value.show = true
        if(error.response.status === 401){
          refreshUserLogin()
        }
      })

    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}


const fetchedPropertyList = ref([])



function populatePropertiesList(){
  let queryData =  {
    "userId": sessionStorage.getItem('userId'),
  }

  axios.get('http://localhost:8000/prop-app/landlord-prop/get', {
    params: queryData,
    headers: {
      "Authorization": sessionStorage.getItem("AccessToken"),
    },
  }).then(response => {
    if (response.status === 200){
      console.log("line 77", response)
      fetchedPropertyList.value = response.data.propertiesData
    }
  }).catch(error => {
    console.log(error)
    if(error.response.status === 401){
      refreshUserLogin()
    }
  })
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function populateFloorsDropdown(){

  if(unitProperty.value){
    fetchedPropertyList.value.forEach(element => {
      if(element.propertyId === unitProperty.value){

        floorList.value = []
        if(element.floors === 0){
          floorList.value.push({
            "text": "ground floor",
            "value": 0,
          })
          
          return
        }
        else{
          for(let i = 0; i < element.floors; i++){

            let key = "floor "+i
            if(i == 0){
              key = "ground floor"
            }
            floorList.value.push({
              "text": key,
              "value": i,
            })
          }
        }
      }
    })
  }
}


watchEffect(populateFloorsDropdown)



onMounted(() => {
  populatePropertiesList()
})
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Add Unit"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm">
            <VRow>
              <!-- 👉 Property -->
              <VCol cols="12">
                <AppSelect
                  v-model="unitProperty"
                  label="Select Property"
                  :rules="[requiredValidator]"
                  :items="fetchedPropertyList"
                  item-title="propertyName"
                  item-value="propertyId"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="unitFloor"
                  label="Select Floor"
                  :items="floorList"
                  item-title="text"
                  item-value="value"
                />
              </VCol>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppTextField
                  v-model="unitName"
                  :rules="[requiredValidator]"
                  label="Unit Name"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppSelect
                  v-model="unitType"
                  :rules="[requiredValidator]"
                  :items="['room', 'shop', 'store', 'office', 'other']"
                  label="Type"
                />
              </VCol>

              <!-- 👉 company -->
              <VCol cols="12">
                <AppTextField
                  v-model="unitRent"
                  type="number"
                  :rules="[requiredValidator]"
                  label="Rent"
                />
              </VCol>

              <!-- 👉 Country -->
              <VCol cols="12">
                <AppTextField
                  v-model="unitBedrooms"
                  type="number"
                  :rules="[requiredValidator]"
                  label="Nos. of Bedrooms"
                />
              </VCol>

              <!-- 👉 Contact -->
              <VCol cols="12">
                <AppTextField
                  v-model="unitBathrooms"
                  type="number"
                  :rules="[requiredValidator]"
                  label="Nos. of bathrooms"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="unitSize"
                  type="number"
                  :rules="[requiredValidator]"
                  label="Unit Size"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect
                  v-model="unitStatus"
                  label="Select Status"
                  :rules="[requiredValidator]"
                  :items="['vacant', 'occupied']"
                />
              </VCol>


              <!--
                <VCol cols="12">
                <VCheckbox
                v-model="singleUnitsCheck"
                label="Single Unit"
                />
                <VRow>
                <VCol
                cols="2"
                sm="1"
                class="d-flex align-end"
                >
                <VCheckbox v-model="multipleUnitsCheck" />
                </VCol>

                <VCol
                cols="8"
                sm="11"
                >
                <AppTextField
                :disabled="!multipleUnitsCheck"
                placeholder="Enter nos of units"
                />
                </VCol>
                </VRow>
                </VCol> 
              -->


              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  class="me-3"
                  @click="onUnitFormSubmit"
                >
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>

  <VSnackbar
    v-model="unitDrawerAlert.show"
    transition="fade-transition"
    location="botton center"
    :color="unitDrawerAlert.color"
  >
    {{ unitDrawerAlert.message }}
  </VSnackbar>
</template>
