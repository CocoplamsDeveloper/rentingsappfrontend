<script setup>
import { getFacilities, refreshUserLogin } from '@/common/reusing_functions'

// import PaymentModeCheckbox from '../tenant/assign/PaymentModeCheckbox.vue'

// import PaymentModeCheckbox from '@/views/apps/tenant/assign/PaymentModeCheckbox.vue'
import axios from '@axios'
import {
floatValidator,
integerValidator,
requiredValidator
} from '@validators'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  editedItemObj: Object,
})
const facilitiesArr = ref([])


const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
  'getAllProperties'
])

// Add more properties as needed


const isFormValid = ref(false)
const refForm = ref()
const editPropertyDrawerAlert = ref({ show: false, message: null, color: null })
const isInputEnabled = ref(false)
const role = ref()
const plan = ref()
const status = ref()
const propertyEditFormImage = ref()
const refFormEditProperty = ref()
const imageUpdateField = ref()
const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
]
const statusToggleSwitch = ref(true)
const updatedImageFile = ref()




const editedProperty = ref(props.editedItemObj)

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refFormEditProperty.value?.reset()
    imageUpdateField.value?.reset()
  })
}

function updatedImageUpload(e){

// console.log(editedItemObj.value.propertyImage, e.target.files[0])

let img = e.target.files[0]
let imgSize = img/1000
if(imgSize > 2048){
  propPageAlertSnackbar.value.message = "Image size should be less then 2MB"
  propPageAlertSnackbar.value.color = "error"
  propPageAlertSnackbar.value.show = true
  propertyEditFormImage.value = 'http://127.0.0.1:8000/media/'+editedProperty.value.propertyImage
  imageUpdateField.value?.reset()

  return
}
propertyEditFormImage.value = URL.createObjectURL(e.target.files[0])
updatedImageFile.value = e.target.files[0]
}


const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}


function changePropertyStatusToggle(){
  if(editedProperty.value.propertyStatus === 'Active'){
    statusToggleSwitch.value = true
  }
  else{
    statusToggleSwitch.value = false
  }
  if(editedProperty.value.propertyImage){
  propertyEditFormImage.value = 'http://127.0.0.1:8000/media/'+editedProperty.value.propertyImage
  }
  else{
    propertyEditFormImage.value = null
  }

  if(editedProperty.value.propertyFacilities){
    facilitiesArr.value.forEach(ele => {
      if (editedProperty.value.propertyFacilities.includes(ele.id)){
        ele.checked = true
      }
    })
  }
}

watchEffect(changePropertyStatusToggle)

function changePropertyStatus(){
  if(statusToggleSwitch.value){
    editedProperty.value.propertyStatus = 'Active'
  }
  else{
    editedProperty.value.propertyStatus = 'Inactive'  
  }
}


function imageFieldChecker(){
  propertyEditFormImage.value = 'http://127.0.0.1:8000/media/'+editedProperty.value.propertyImage
}

function updateProperty(){


refFormEditProperty.value?.validate().then(({valid}) => {

if(valid){

if(!editedProperty.value.propertyBuyValue){
  editedProperty.value.propertyBuyValue = 0
}
if(!editedProperty.value.propertySaleValue){
  editedProperty.value.propertySaleValue = 0
}
if(!editedProperty.value.propertyConstructionCost){
  editedProperty.value.propertyConstructionCost = 0
}  

const formData = new FormData()

formData.append('userId', sessionStorage.getItem('userId'))
formData.append('data', JSON.stringify(editedProperty.value))
formData.append('facilities', JSON.stringify(facilitiesArr.value))

if(propertyEditFormImage.value){
let imgstr = propertyEditFormImage.value.split("media/")
imgstr = imgstr[1]
if(imgstr !== editedProperty.value.propertyImage){
  formData.append('updatedImage', updatedImageFile.value)
}
}

axios.post('http://localhost:8000/prop-app/property/update', formData, {
  headers: {
    'Authorization': sessionStorage.getItem("AccessToken"),  
  },

}).then(response => {
  editPropertyDrawerAlert.value.message = response.data.message
  editPropertyDrawerAlert.value.color = "success"
  editPropertyDrawerAlert.value.show = true
  emit('getAllProperties')
  closeNavigationDrawer()
}).catch(error => {
  editPropertyDrawerAlert.value.message = error.response.data.message
  editPropertyDrawerAlert.value.color = "error"
  editPropertyDrawerAlert.value.show = true
  if(error.response.status === 403){
    refreshUserLogin()
  }
})

}
else{
  editPropertyDrawerAlert.value.message = "Kindly fill required details"
  editPropertyDrawerAlert.value.color = "error"
  editPropertyDrawerAlert.value.show = true
}

})
}

function createFacCheckboxes(data){
  data.forEach(ele => {
    facilitiesArr.value.push({
      "id" : ele.facility_id,
      "name": ele.name,
      "checked": false
    })
  })
}



onMounted(() => {
  getFacilities().then((res) => {
    if(res.status === 200){
      createFacCheckboxes(res.data.facilities)
    } 
  })

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
          <VForm ref="refFormEditProperty">
            <VRow>
              <!-- 👉 Property -->
              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyName"
                  :rules="[requiredValidator]"
                  label="Property"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyNumber"
                  :rules="[requiredValidator, integerValidator]"
                  label="Propery Number"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="editedProperty.propertyType"
                  label="Property Type"
                  :rules="[requiredValidator]"
                  :items="['Residential', 'Commercial']"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertySize"
                  :rules="[requiredValidator, floatValidator]"
                  label="Propery Size"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyCity"
                  :rules="[requiredValidator]"
                  label="Propery City"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyBuiltYear"
                  :rules="[requiredValidator, integerValidator]"
                  label="Propery Built Year"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyFloors"
                  :rules="[requiredValidator, integerValidator]"
                  label="Total floors"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="editedProperty.propertyCountry"
                  label="Country"
                  :rules="[requiredValidator]"
                  :items="countryList"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyZipCode"
                  label="Zip Code"
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyStreet"
                  :rules="[requiredValidator]"
                  label="Propery Street"

                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyBlock"
                  :rules="[requiredValidator]"
                  label="Propery Block"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyLicenseNo"
                  label="License No"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertySaleValue"
                  label="Property Sale Value"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyBuyValue"
                  label="Property Buy Value"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyConstructionCost"
                  label="Construction cost(estimate)"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="editedProperty.propertyRentType"
                  :items="['Monthly', 'Yearly']"
                  label="Rent type"
                />
              </VCol>
           
              <VCol cols="12">
                <AppTextField
                  v-model="editedProperty.propertyDescription"
                  label="Property Description"
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
                      style="height: 110px;"
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
                  v-model="statusToggleSwitch"
                  label="Property Status"
                  @change="changePropertyStatus"
                />
              </VCol>

              <VCol
                cols="12"
                >
                <p>Facilities</p>
                <VRow :style="{marginTop: '10px'}">
                  <div class="demo-space-x"              
                  v-for="fac in facilitiesArr"
                  :key="fac.id" :style="{marginLeft: '10px'}">
                    <!-- <div :style="{marginLeft: '20px'}">
                    <label>{{ fac.name.toUpperCase() }}</label>
                    <div :style="{marginLeft: '10px'}"> -->


                      <VCheckbox
                        v-model="fac.checked"
                        :label="fac.name.toUpperCase()"
                      />
                    <!-- </div>
                    </div> -->
                  </div>
              </VRow>
                <!-- </div> -->
              </VCol>
    
              
              <VCol cols="12">
                <VBtn
                  class="me-3"
                  @click="updateProperty(editedProperty.propertyId)"
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
    v-model="editPropertyDrawerAlert.show"
    transition="fade-transition"
    location="botton center"
    :color="editPropertyDrawerAlert.color"
  >
    {{ editPropertyDrawerAlert.message }}
  </VSnackbar>
</template>
