<script setup>
import { floatValidator, integerValidator, requiredValidator } from '@/@core/utils/validators'
import codes_data from '@/common/codes_data'
import axios from '@axios'



const props = defineProps({
  editedPropertyObj:{
    type : Object,
    required: true 
  },
  facilityData:{
    type:Array,
    required:true,
  }
})

const emit = defineEmits([
  'fetchProperty'
]) 

const editedProperty = ref(props.editedPropertyObj)
const facilitiesArr = ref(props.facilityData)
const propertyEditFormImg = ref()
const propertyNewImg = ref()
const countriesList = codes_data
const refInputEl = ref()

const changeAvatar = file => {
  propertyEditFormImg.value = URL.createObjectURL(file.target.files[0])
  propertyNewImg.value = file.target.files[0]
}

// reset avatar image
const resetAvatar = () => {

if(editedProperty.value.propertyImage){
  propertyEditFormImg.value = 'http://localhost:8000/media/'+editedProperty.value.propertyImage
  propertyNewImg.value = null
}
else{
  propertyEditFormImg.value = avatar1
  propertyNewImg.value = null
}

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





// function watchProp(){
//   if(editedProperty.value.propertyStatus === 'Active'){
//     statusToggleSwitch.value = true
//   }
//   else{
//     statusToggleSwitch.value = false
//   }

// }

// watchEffect(changePropertyStatusToggle)

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

const formData = new FormData()

formData.append('userId', sessionStorage.getItem('userId'))
formData.append('data', JSON.stringify(editedProperty.value))
formData.append('facilities', JSON.stringify(props.facilityData))

if(propertyNewImg.value !== null){
  formData.append('updatedImage', propertyNewImg.value)

}

axios.post('http://localhost:8000/prop-app/property/update', formData, {
  headers: {
    'Authorization': sessionStorage.getItem("AccessToken"),  
  },

}).then(response => {
  editPropertyDrawerAlert.value.message = response.data.message
  editPropertyDrawerAlert.value.color = "success"
  editPropertyDrawerAlert.value.show = true
}).catch(error => {
  editPropertyDrawerAlert.value.message = error.response.data.message
  editPropertyDrawerAlert.value.color = "error"
  editPropertyDrawerAlert.value.show = true
  if(error.response.status === 403){
    refreshUserLogin()
  }
})
}







const projectTableHeaders = [
  {
    title: 'PROJECT',
    key: 'name',
  },
  {
    title: 'TOTAL TASK',
    key: 'totalTask',
  },
  {
    title: 'PROGRESS',
    key: 'progress',
  },
  {
    title: 'HOURS',
    key: 'hours',
  },
]

const search = ref('')

const options = ref({
  itemsPerPage: 5,
  page: 1,
})

const projects = [
  // {
  //   logo: react,
  //   name: 'BGC eCommerce App',
  //   project: 'React Project',
  //   totalTask: '122/240',
  //   progress: 78,
  //   hours: '18:42',
  // },
  // {
  //   logo: figma,
  //   name: 'Falcon Logo Design',
  //   project: 'Figma Project',
  //   totalTask: '09/56',
  //   progress: 18,
  //   hours: '20:42',
  // },
  // {
  //   logo: vue,
  //   name: 'Dashboard Design',
  //   project: 'Vuejs Project',
  //   totalTask: '290/320',
  //   progress: 62,
  //   hours: '120:87',
  // },
  // {
  //   logo: xamarin,
  //   name: 'Foodista mobile app',
  //   project: 'Xamarin Project',
  //   totalTask: '290/320',
  //   progress: 8,
  //   hours: '120:87',
  // },
  // {
  //   logo: python,
  //   name: 'Dojo Email App',
  //   project: 'Python Project',
  //   totalTask: '120/186',
  //   progress: 49,
  //   hours: '230:10',
  // },
  // {
  //   logo: sketch,
  //   name: 'Blockchain Website',
  //   project: 'Sketch Project',
  //   totalTask: '99/109',
  //   progress: 92,
  //   hours: '342:41',
  // },
  // {
  //   logo: html5,
  //   name: 'Hoffman Website',
  //   project: 'HTML Project',
  //   totalTask: '98/110',
  //   progress: 88,
  //   hours: '12:45',
  // },
]

const resolveUserProgressVariant = progress => {
  if (progress <= 25)
    return 'error'
  if (progress > 25 && progress <= 50)
    return 'warning'
  if (progress > 50 && progress <= 75)
    return 'primary'
  if (progress > 75 && progress <= 100)
    return 'success'
  
  return 'secondary'
}

function watchFormDetails(){
  if(editedProperty.value.propertyFacilities){
    props.facilityData.forEach((ele) => {
      if(editedProperty.value.propertyFacilities.includes(ele.id)){
        ele.checked = true
      }
    })
  }

  if(editedProperty.value.propertyImage){
  propertyEditFormImg.value = 'http://127.0.0.1:8000/media/'+editedProperty.value.propertyImage
  }
  else{
    propertyEditFormImg.value = null
  }
}
watchEffect(watchFormDetails)

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Property" v-if="editedProperty">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            size="150"
            class="me-6"
            :image="propertyEditFormImg"
          >
          </VAvatar>

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
                prepend-icon="tabler-edit"
                size="24"
              >
                <!-- <VIcon
                  icon="tabler-cloud-upload"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span> -->
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                @click="resetAvatar"
                prepend-icon="tabler-refresh"
                size="24"
              >
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm
            ref="editlandlordRefForm"
            class="mt-6"
          >
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="4"
                cols="12"
              >
              <AppTextField
                  v-model="editedProperty.propertyName"
                  :rules="[requiredValidator]"
                  label="Name*"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="4"
                cols="12"
              >
              <AppSelect
                  v-model="editedProperty.propertyType"
                  :rules="[requiredValidator]"
                  label="Type*"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="4"
              >
              <AppSelect
                  v-model="editedProperty.propertyCountry"
                  :rules="[requiredValidator]"
                  label="Country*"
                  :items="countriesList"
                  item-title="country"
                  item-value="country"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertyZipCode"
                  :rules="[requiredValidator]"
                  label="Zip Code*"

                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertyCity"
                  :rules="[requiredValidator]"
                  label="City*"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertyStreet"
                  label="Street*"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertyBlock"
                  :rules="[requiredValidator]"
                  label="Block*"
                  :items="countriesList"
                  item-title="country"
                  item-value="country"
                />
              </VCol>



              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertyNumber"
                  :rules="[requiredValidator, integerValidator]"
                  label="Property Number*"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertyBuiltYear"
                  :rules="[requiredValidator]"
                  label="Built Year*"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertySize"
                  label="Property Size*"
                  :rules="[requiredValidator, floatValidator]"
                />
              </VCol>


              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertyFloors"
                  label="Total floors*"
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol>


              <VCol 
              cols="12"
              md="4">
                <AppSelect
                  v-model="editedProperty.propertyStatus"
                  label="Status*"
                  :rules="[requiredValidator]"
                  :items="['Active', 'Inactive']"
                />
              </VCol>
              <!-- 👉 Address -->

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="editedProperty.propertyLicenseNo"
                  label="License No "
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4"
              >
                <AppTextField
                  v-model="editedProperty.propertySaleValue"
                  label="Property Sale Value"
                  :rules="[requiredValidator, floatValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="editedProperty.propertyBuyValue"
                  label="Property Buy Value"
                  :rules="[requiredValidator, floatValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="editedProperty.propertyConstructionCost"
                  label="Construction cost(estimate)"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol 
              cols="12"
              md="4">
                <AppSelect
                  v-model="editedProperty.propertyRentType"
                  label="Rent Type"
                  :items="['Monthly', 'Yearly']"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="editedProperty.propertyDescription"
                  label="Property Description"
                />
              </VCol>

              <VCol
                cols="12"
                >
                <p>Facilities</p>
                <VRow >
                  <div class="demo-space-x"              
                  v-for="fac in props.facilityData"
                  :key="fac.id" :style="{marginLeft: '15px'}">
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
              </VCol>
              


              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click="updateProperty">
                  Save Changes
                </VBtn>

              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>



  <!-- <VSnackbar
    v-model="landlordProfileTabAlert.show"
    transition="fade-transition"
    location="botton center"
    :color="landlordProfileTabAlert.color"
  >
    {{ landlordProfileTabAlert.message }}
  </VSnackbar> -->

</template>
