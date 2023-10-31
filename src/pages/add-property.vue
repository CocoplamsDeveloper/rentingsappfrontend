<script setup>
import { integerValidator, requiredValidator } from '@/@core/utils/validators'
import { refreshUserLogin } from '@/common/reusing_functions'
import axios from '@axios'

const router = useRouter()


const tab = ref('personal-info')
const propertyName = ref('')
const propertyBlock = ref('')
const propertyCountry = ref()
const propertyCity = ref()
const propertyStreet = ref('')
const propertyNumber = ref()
const propertyStatus = ref()
const propertyBuiltYear = ref ()
const propertySize = ref()
const propertySalePrice = ref()
const propertyBoughtPrice = ref()
const propertyDescription = ref()
const propertyIdNo = ref()
const propertyImageRef = ref()
const selectedProperty = ref(null)
const propertyType = ref()
const propDetailsForm = ref()
const alertSnackbar = ref({ show: false, message: null, color: null })
const otherDetailsForm = ref()
const otherDetailsWindow = ref()
const propertyFloors = ref(0)
let imageFile = null

const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
]

const propertyTypeOptions = [
  'Residential',
  'Commercial',
]

const availableProperties = ref([])


async function addPropertyFunc(){

  propDetailsForm.value?.validate().then(({ valid: isValid })=>{
    if(isValid){
      let propertywisedata = {
        "userId": sessionStorage.getItem("userId"),
        "propertyName": propertyName.value,
        "governateName": propertyCountry.value,
        "propertyCity": propertyCity.value,
        "propertyStreet": propertyStreet.value,
        "propertyBlock": propertyBlock.value,
        "propertyNumber": propertyNumber.value,
        "propertyBuiltYear": propertyBuiltYear.value,
        "propertyType": propertyType.value,
        "propertyStatus": propertyStatus.value,
        "propertySize": propertySize.value,
        "propertyFloor": propertyFloors.value,
      }

      if(!sessionStorage.getItem("accessToken")){
        router.push('/login')

        return 
      }

      axios.post('http://backend-rentings-env.eba-bdnqs3bn.me-south-1.elasticbeanstalk.com/prop-app/add', propertywisedata, {
        headers: {
          'Authorization': sessionStorage.getItem("AccessToken"),  
        },

      }).then(response => {
        if(response.status === 201){
          alertSnackbar.value.message = response.data.message
          alertSnackbar.value.color = "success"
          alertSnackbar.value.show = true
          propDetailsForm?.value.reset()
        }

      }).catch(error => {
        alertSnackbar.value.message = error.response.data.message
        alertSnackbar.value.color = "error"
        alertSnackbar.value.show = true
        if(error.response.status === 401){
          refreshUserLogin()
        }
      })
    }
    else{
      tab.value = "property-info"
      alertSnackbar.value.message = "Please enter details to create property!"
      alertSnackbar.value.color = "warning"
      alertSnackbar.value.show = true
      propDetailsForm?.value.reset()
    }
  })
}

async function submitPropertyGoToOther(){
  await addPropertyFunc()
  tab.value = "other-details"

}


async function getUserPropertiesList(){
  let queryData =  {
    "userId": sessionStorage.getItem('userId'),
  }
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')
    
    return 
  }

  axios({
    url: 'http://backend-rentings-env.eba-bdnqs3bn.me-south-1.elasticbeanstalk.com/prop-app/landlord-prop/get',
    params: queryData,
    method: "GET",
    headers: {
      "Authorization": sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    if (response.status === 200){
      availableProperties.value = response.data.propertiesData
    }
  }).catch(error => {
    console.log(error)
    if(error.response.status === 401){
      refreshUserLogin()
    }

  })
}

function imageUpload(e){
  imageFile = e.target.files[0]
  let imageFileSize = imageFile.size/1000
  if(imageFileSize > 2048){
    alertSnackbar.value.message = "Image size should be less then 2MB"
    alertSnackbar.value.color = "error"
    alertSnackbar.value.show = true
    propertyImageRef.value?.reset()
  }
}


function addPropertyAdditionalDetails(){

  // otherDetailsWindow.click
  if(!selectedProperty.value){
    alertSnackbar.value.message = "Select the Property to proceed!"
    alertSnackbar.value.color = "error"
    alertSnackbar.value.show = true

    return 
  }

  otherDetailsForm?.value.validate().then(({ valid: isValid }) => {
    if(isValid){
      if(!sessionStorage.getItem("accessToken")){
        router.push('/login')

        return 
      }
      const formData = new FormData()
      if(imageFile){
        formData.append('imageFile', imageFile)
      }
      let propertyAdditionalData = {
        "propertyId": selectedProperty.value,
        "propertySaleValue": propertySalePrice.value,
        "propertyBuyValue": propertyBoughtPrice.value,
        "propertyCivilId": propertyIdNo.value,
        "propertyDescription": propertyDescription.value,
      }
      formData.append('data', JSON.stringify(propertyAdditionalData))
      formData.append('userId', sessionStorage.getItem('userId'))
      axios.post('http://backend-rentings-env.eba-bdnqs3bn.me-south-1.elasticbeanstalk.com/prop-app/property-details/add', formData, {
        headers: {
          'Authorization': sessionStorage.getItem("AccessToken"),  
        },

      }).then(response => {
        alertSnackbar.value.message = response.data.message
        alertSnackbar.value.color = "success"
        alertSnackbar.value.show = true
        otherDetailsForm?.value.reset()

      }).catch(error => {
        alertSnackbar.value.message = error.response.data.message
        alertSnackbar.value.color = "error"
        alertSnackbar.value.show = true
        if(error.response.status === 401){
          refreshUserLogin()
        }
      })
    }
    else{

    }
  })
}


onMounted(() => {
  getUserPropertiesList()
})
</script>


<template>
  <p class="addPropertyHeader">
    Add Your Property
  </p>
  <VTabs v-model="tab">
    <VTab value="property-info">
      Property Info
    </VTab>
    <VTab value="other-details">
      Other Details
    </VTab>
  </VTabs>

  <VCard flat>
    <VCardText>
      <VWindow
        v-model="tab"
        class="disable-tab-transition"
      >
        <VWindowItem value="property-info">
          <VForm
            ref="propDetailsForm"
            lazy-validation
            class="mt-2"
          >
            <VRow>
              <VCol
                md="4"
                cols="12"
              >
                <AppTextField
                  v-model="propertyName"
                  label="Property Name *"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                md="4"
                cols="12"
              >
                <AppSelect
                  v-model="propertyType"
                  :items="propertyTypeOptions"
                  chips
                  clearable
                  label="Property Type *"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="propertyCountry"
                  :items="countryList"
                  label="Country/Governate *"
                  chips
                  clearable
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="propertyCity"
                  label="City *"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="propertyStreet"
                  label="Street *"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="propertyBlock"
                  label="Block *"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="propertyNumber"
                  label="Property Number *"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="propertyBuiltYear"
                  label="Built Year *"
                  :rules="[integerValidator, requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="propertyStatus"
                  :items="['Active', 'Inactive']"
                  chips
                  label="Status *"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="propertySize"
                  label="Property Size *"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="propertyFloors"
                  label="Nos. Of floors*"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol
                cols="18"
                md="6"
              >
                <VBtn 
                  color="warning"
                  :style="{marginRight: '10px'}"
                  @click="submitPropertyGoToOther"
                >
                  Continue
                </VBtn>
                <VBtn
                  :style="{marginRight: '10px'}"
                  @click="addPropertyFunc"
                >
                  Submit
                </VBtn>
                <VBtn
                  color="secondary"
                  variant="tonal"
                  @click="propDetailsForm?.reset()"
                >
                  Clear
                </VBtn>
              </VCol>
            </VRow>
          </VForm>


          <!-- <VDivider /> -->
        </VWindowItem>

        <VWindowItem
          ref="otherDetailsWindow"
          value="other-details"
          @click="getUserPropertiesList"
        >
          <VForm
            ref="otherDetailsForm" 
            class="mt-2"
          >
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="selectedProperty"
                  :items="availableProperties"
                  item-title="propertyName"
                  item-value="propertyId"
                  label="Select Property"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="propertyIdNo" 
                  label="Property Civil Id/Registred No."
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <label>Property Image</label>
                <VFileInput
                  ref="propertyImageRef"
                  prepend-icon="tabler-camera"
                  label="Image"
                  chips
                  accept="image/*"
                  density="compact"
                  @change="imageUpload"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="propertySalePrice"
                  label="Property Sale Value"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="propertyBoughtPrice"
                  label="Property Bought Value"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="propertyDescription"
                  label="Property Description"
                  :rules="[requiredValidator]"
                />
              </VCol>
              
              <VCol
                cols="18"
                md="6"
              >
                <VBtn
                  :style="{marginRight: '10px'}"
                  @click="addPropertyAdditionalDetails"
                >
                  Submit
                </VBtn>
                <VBtn
                  color="secondary"
                  variant="tonal"
                  @click="otherDetailsForm?.reset()"
                >
                  Clear
                </VBtn>
              </VCol>
            </VRow>
          </VForm>

          <!-- <VDivider /> -->
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>


  <VSnackbar
    v-model="alertSnackbar.show"
    transition="fade-transition"
    location="botton center"
    :color="alertSnackbar.color"
  >
    {{ alertSnackbar.message }}
  </VSnackbar>
</template>


