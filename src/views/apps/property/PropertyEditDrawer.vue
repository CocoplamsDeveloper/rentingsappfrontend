<script setup>
import { refreshUserLogin } from '@/common/reusing_functions'

// import PaymentModeCheckbox from '../tenant/assign/PaymentModeCheckbox.vue'

// import PaymentModeCheckbox from '@/views/apps/tenant/assign/PaymentModeCheckbox.vue'
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
  selectedItem: Object,
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])


const selectedItemRef = ref(props.selectedItem)

// Use watch to react to changes in selectedItem
watch(
  () => props.selectedItem,
  (newVal, oldVal) => {
    // Access and process the updated value of selectedItem here
    console.log("Selected Item Updated: ", newVal)
    
    // Update the selectedItemRef to show the new value in the <h1> tag
    selectedItemRef.value = newVal
    
    // You can perform additional logic or updates based on the new value of selectedItem
  },
  { immediate: true },
)


console.log("selectedItemRef: ", selectedItemRef.value)
console.log("1234", props?.selectedItem)
console.log("12345", props)

// Add more properties as needed

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
const propertyEditFormImage = ref()
const propertyStatus = ref()

const colorCheckbox = ref([
  'Cash',
  'Cheque',
  'Online',
])

const needsCheck = ref([
  'Water',
  'Electricity',
  'Telephone',
  'Internet',
])

const selectedCheckbox = ref([])
const selectCheckMethod = ref([])

const editedItemObj = ref({
  "propertyId": '',
  "propertyName": '',
  "propertyType": '',
  "propertyNumber": '',
  "propertyCity": '',
  "propertyStreet": '',
  "propertyBlock": '',
  "propertyStatus": '',
  "propertyCivilId": '',
  "propertyImage": '',
  "propertyDescription": '',
  "propertySize": '',
  "propertyBuiltYear": '',
  "propertyBuyValue": '',
  "propertySaleValue": '',
  "propertyCountry": '',
})

watch(unitProperty, (newValue, oldValue) => {
  // Handle the change in unitProperty here
  console.log('New value:', newValue)
  console.log('Old value:', oldValue)

  // You can perform any additional logic or actions as needed
})

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

function updatedImageUpload(e){

  // console.log(editedItemObj.value.propertyImage, e.target.files[0])

  let img = e.target.files[0]
  let imgSize = img/1000
  if(imgSize > 2048){
    // propPageAlertSnackbar.value.message = "Image size should be less then 2MB"
    // propPageAlertSnackbar.value.color = "error"
    // propPageAlertSnackbar.value.show = true
    propertyEditFormImage.value = 'http://127.0.0.1:8000/media/'+editedItemObj.value.propertyImage

    // imageUpdateField.value?.reset()

    return
  }
  propertyEditFormImage.value = URL.createObjectURL(e.target.files[0])

  // updatedImageFile.value = e.target.files[0]
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
          "Property": property.value,
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

  axios('http://localhost:8000/prop-app/landlord-prop/get', {
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
      title="Edit Property"
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
                <AppTextField
                  v-model="property"
                  :rules="[requiredValidator]"
                  label="Property"
                  :value="selectedItemRef?.details?.property_name"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="propertyNumber"
                  :rules="[requiredValidator]"
                  label="Propery Number"
                  :value="selectedItemRef?.details?.property_number"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="unitProperty"
                  label="Property Type"
                  :rules="[requiredValidator]"
                  :items="fetchedPropertyList"
                  item-title="propertyType"
                  item-value="propertyId"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="propertySize"
                  :rules="[requiredValidator]"
                  label="Propery Size"
                  :value="selectedItemRef?.details?.property_size"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="propertyCity"
                  :rules="[requiredValidator]"
                  label="Propery City"
                  :value="selectedItemRef?.details?.property_city"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="propertyBuiltYear"
                  :rules="[requiredValidator]"
                  label="Propery Built Year"
                  :value="selectedItemRef?.details?.property_built_year"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="country"
                  label="Country"
                  :items="country"
                  item-title="country"
                  item-value="countryId"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="propertyStreet"
                  :rules="[requiredValidator]"
                  label="Propery Street"
                  :value="selectedItemRef?.details?.property_street"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="propertyBlock"
                  :rules="[requiredValidator]"
                  label="Propery Block"
                  :value="selectedItemRef?.details?.property_block"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="propertyCivilId"
                  :rules="[requiredValidator]"
                  label="Civil/Registered No"
                  :value="selectedItemRef?.details?.property_civil_id"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="propertySaleValue"
                  :rules="[requiredValidator]"
                  label="Property Sale Value"
                  :value="selectedItemRef?.details?.selling_price"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="propertyBuyValue"
                  :rules="[requiredValidator]"
                  label="Property Buy Value"
                  :value="selectedItemRef?.details?.buying_price"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="propertyDescription"
                  :rules="[requiredValidator]"
                  label="Property Description"
                  :value="selectedItemRef?.details?.property_description"
                />
              </VCol>
              
              <VCol
                cols="12"
                sm="6"
                md="12"
              >
                <VCard>
                  <template v-if="propertyEditFormImage">
                    <VImg
                      :src="propertyEditFormImage"
                      alt="No image"
                      cover
                      style="width: 110px; height: 110px;"
                    />
                  </template>

                  <VCardItem>
                    <p>Click below to change/add Image</p>
                    <VFileInput
                      ref="imageUpdateField"
                      prepend-icon="tabler-camera"
                      label="Image"
                      accept="image/*"
                      density="compact"
                      clearable
                      @click:clear="imageFieldChecker"
                      @change="updatedImageUpload"
                    />
                  </VCardItem>
                </VCard>
              </VCol>

              <VCol cols="12">
                <VSwitch
                  v-model="propertyStatus"
                  label="Property Status"
                  value="propertyStatus"
                />
              </VCol>
    
              
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
