<script setup>

import { refreshUserLogin } from '@/common/reusing_functions'
import axios from '@axios'
import {
floatValidator,
requiredValidator,
} from '@validators'
import { ref } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  singleUnit: Object,
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'getAllUnits'
])

// Add more properties as needed


const isFormValid = ref(false)
const refForm = ref()
const editUnitDrawerAlert = ref({ show: false, message: null, color: null })
const isInputEnabled = ref(false)
const role = ref()
const plan = ref()
const status = ref()
const editUnitRefForm = ref()
const unitTypeArr = ref([])
const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
]
const statusToggleSwitch = ref(true)
const updatedImageFile = ref()




const editedUnit = ref(props.singleUnit)

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    editUnitRefForm.value?.reset()
  })
}



const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}


function updateUnits(){

  editUnitRefForm.value?.validate().then(({ valid })=>{
    if(valid){

      if(!unitTypeArr.value.includes(editedUnit.value.type)){
        editUnitDrawerAlert.value.message = "select proper type for unit!"
        editUnitDrawerAlert.value.show = true
        editUnitDrawerAlert.value.color = "error"
        return
      }
      let queryData = {
      "userId" : sessionStorage.getItem("userId"),
      "updatedUnit": editedUnit.value
      }

  axios.post("http://127.0.0.1:8000/prop-app/units/update",queryData,{
    headers: {
      'Authorization': sessionStorage.getItem("accessToken")
    }
  }).then(response => {
    if(response.status === 200){
      editUnitDrawerAlert.value.message = response.data.message
      editUnitDrawerAlert.value.color = "success"
      editUnitDrawerAlert.value.show = true
      emit('update:isDrawerOpen', false)
      emit('getAllUnits')
    }
  }).catch(error => {
      editUnitDrawerAlert.value.message = error.response.data.message
      editUnitDrawerAlert.value.color = "error"
      editUnitDrawerAlert.value.show = true
     if(error.response.status === 403){
      refreshUserLogin()
     }
  })
  }
  else{
    editUnitDrawerAlert.value.message = "fill the required fields!"
    editUnitDrawerAlert.value.color = "error"
    editUnitDrawerAlert.value.show = true
  }

  })

}



// console.log(props.singleUnit)
function changeFloorsTypes(){

  if(editedUnit.value.floor == 0){
    editedUnit.value.floor = "ground floor"
  }
  else{
    editedUnit.value.floor = "floor "+editedUnit.value.floor
  }
  if(editedUnit.value.category === "Commercial"){
    unitTypeArr.value = []
    unitTypeArr.value.push("Shop")
    unitTypeArr.value.push("Office")
  }
  if(editedUnit.value.category === "Residential"){

    unitTypeArr.value = []
    unitTypeArr.value.push("Room")
  }
}

watchEffect(changeFloorsTypes)


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
      title="Edit Unit"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat v-if="editedUnit">
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="editUnitRefForm">
            <VRow>
              <!-- 👉 Property -->
              <VCol cols="12">
                <AppTextField
                  v-model="editedUnit.propertyName"
                  label="Property"
                  readonly
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedUnit.floor"
                  label="Floor"
                  readonly
                />
              </VCol>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppTextField
                  v-model="editedUnit.name"
                  :rules="[requiredValidator]"
                  label="Unit Name"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="editedUnit.category"
                  :rules="[requiredValidator]"
                  :items="['Commercial', 'Residential']"
                  label="Category"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppSelect
                  v-model="editedUnit.type"
                  :rules="[requiredValidator]"
                  :items="unitTypeArr"
                  label="Type"
                />
              </VCol>

              <!-- 👉 company -->
              <VCol cols="12">
                <AppTextField
                  v-model="editedUnit.rent"
                  :rules="[requiredValidator]"
                  label="Rent"
                />
              </VCol>

              <!-- 👉 Country -->
              <VCol cols="12">
                <AppTextField
                  v-model="editedUnit.bedrooms"
                  type="number"
                  :min=0
                  :rules="[requiredValidator]"
                  label="Nos. of Bedrooms"
                />
              </VCol>

              <!-- 👉 Contact -->
              <VCol cols="12">
                <AppTextField
                  v-model="editedUnit.bathrooms"
                  type="number"
                  :min=0
                  :rules="[requiredValidator]"
                  label="Nos. of bathrooms"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedUnit.kitchens"
                  type="number"
                  :min=0
                  :rules="[requiredValidator]"
                  label="Nos. of kitchens"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="editedUnit.size"
                  type="number"
                  :rules="[requiredValidator, floatValidator]"
                  label="Unit Size"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect
                  v-model="editedUnit.status"
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
                  @click="updateUnits"
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
    v-model="editUnitDrawerAlert.show"
    transition="fade-transition"
    location="botton center"
    :color="editUnitDrawerAlert.color"
  >
    {{ editUnitDrawerAlert.message }}
  </VSnackbar>


</template>
