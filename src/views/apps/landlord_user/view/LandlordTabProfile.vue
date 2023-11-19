<script setup>

import { emailValidator, integerValidator, passwordValidator, requiredValidator } from '@/@core/utils/validators'
import codes_data from '@/common/codes_data'
import { refreshUserLogin } from '@/common/reusing_functions'
import axios from "@axios"
import avatar1 from '@images/avatars/avatar-14.png'


const props = defineProps({
  landlordDetailsToEdit: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'getSingleLandlord'
])

const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
]


const countriesList = ref(codes_data)
const landlordObj = ref(props.landlordDetailsToEdit)
const landlordNewImage = ref(null)
const landlordFormImage = ref()
const refInputEl = ref()
const editlandlordRefForm = ref()
const landlordProfileTabAlert = ref({ show: false, message: null, color: null })
const phoneCode = ref()

const changeAvatar = file => {
landlordFormImage.value = URL.createObjectURL(file.target.files[0])
landlordNewImage.value = file.target.files[0]
}

// reset avatar image
const resetAvatar = () => {

if(landlordObj.value.landlordImage){
  landlordFormImage.value = 'http://localhost:8000/media/'+landlordObj.value.landlordImage
  landlordNewImage.value = null
}
else{
  landlordFormImage.value = avatar1
  landlordNewImage.value = null
}

}

const nationalityList = [
  'Afghan',		
  'Albanian',		
  'Algerian',		
  'American',		
  'Andorran',		
  'Angolan',	
  'Anguillan',		
  'Argentine',		
  'Armenian',		
  'Australian',		
  'Austrian',		
  'Azerbaijani',		
  'Bahamian',		
  'Bahraini',		
  'Bangladeshi',		
  'Barbadian',		
  'Belarusian',		
  'Belgian',		
  'Belizean',	
  'Beninese',	
  'Bermudian',		
  'Bhutanese',		
  'Bolivian',	
  'Botswanan',		
  'Brazilian',		
  'British',	
  'British Virgin Islander',		
  'Bruneian',		
  'Bulgarian',		
  'Burkinan',		
  'Burmese',		
  'Burundian',		
  'Cambodian',		
  'Cameroonian',		
  'Canadian',		
  'Cape Verdean',		
  'Cayman Islander',		
  'Central African',		
  'Chadian',		
  'Chilean',		
  'Chinese',		
  'Citizen of Antigua and Barbuda',
  'Citizen of Bosnia and Herzegovina',		
  'Citizen of Guinea-Bissau',		
  'Citizen of Kiribati',		
  'Citizen of Seychelles',		
  'Citizen of the Dominican Republic',		
  'Citizen of Vanuatu', 		
  'Colombian',		
  'Comoran',		
  'Congolese (Congo)',		
  'Congolese (DRC)',		
  'Cook Islander',		
  'Costa Rican',		
  'Croatian',		
  'Cuban',		
  'Cymraes',		
  'Cymro',		
  'Cypriot',		
  'Czech',		
  'Danish',		
  'Djiboutian',		
  'Dominican',		
  'Dutch',		
  'East Timorese',		
  'Ecuadorean',		
  'Egyptian',		
  'Emirati',		
  'English',		
  'Equatorial Guinean',		
  'Eritrean',		
  'Estonian',		
  'Ethiopian',		
  'Faroese',		
  'Fijian',		
  'Filipino',		
  'Finnish',		
  'French',	
  'Gabonese',		
  'Gambian',		
  'Georgian',		
  'German',		
  'Ghanaian',		
  'Gibraltarian',		
  'Greek',		
  'Greenlandic',		
  'Grenadian',		
  'Guamanian',		
  'Guatemalan',		
  'Guinean',		
  'Guyanese',		
  'Haitian',		
  'Honduran	',	
  'Hong Konger',		
  'Hungarian',		
  'Icelandic',		
  'Indian',		
  'Indonesian',		
  'Iranian',		
  'Iraqi',		
  'Irish',		
  'Israeli',		
  'Italian',		
  'Ivorian',		
  'Jamaican',		
  'Japanese',		
  'Jordanian',		
  'Kazakh',		
  'Kenyan',		
  'Kittitian',		
  'Kosovan',		
  'Kuwaiti',		
  'Kyrgyz',		
  'Lao',		
  'Latvian',		
  'Lebanese',		
  'Liberian',		
  'Libyan',		
  'Liechtenstein citizen',	
  'Lithuanian',		
  'Luxembourger',		
  'Macanese',		
  'Macedonian',		
  'Malagasy',		
  'Malawian',	
  'Malaysian',		
  'Maldivian',		
  'Malian',		
  'Maltese',		
  'Marshallese',		
  'Martiniquais',		
  'Mauritanian',		
  'Mauritian',		
  'Mexican',		
  'Micronesian',		
  'Moldovan',		
  'Monegasque',		
  'Mongolian',		
  'Montenegrin',		
  'Montserratian',		
  'Moroccan',		
  'Mosotho',		
  'Mozambican',		
  'Namibian',		
  'Nauruan',		
  'Nepalese',	
  'New Zealander',		
  'Nicaraguan',		
  'Nigerian',		
  'Nigerien',		
  'Niuean',		
  'North Korean',		
  'Northern Irish',		
  'Norwegian',		
  'Omani',		
  'Pakistani',		
  'Palauan',		
  'Palestinian',		
  'Panamanian',		
  'Papua New Guinean',		
  'Paraguayan',		
  'Peruvian',		
  'Pitcairn Islander',		
  'Polish',		
  'Portuguese',		
  'Prydeinig',		
  'Puerto Rican',		
  'Qatari',		
  'Romanian',		
  'Russian',		
  'Rwandan',		
  'Salvadorean',		
  'Sammarinese',		
  'Samoan',		
  'Sao Tomean',		
  'Saudi Arabian',		
  'Scottish',		
  'Senegalese',		
  'Serbian',		
  'Sierra Leonean',		
  'Singaporean',		
  'Slovak',		
  'Slovenian',		
  'Solomon Islander',		
  'Somali',		
  'South African',		
  'South Korean',		
  'South Sudanese',		
  'Spanish',		
  'Sri Lankan',		
  'St Helenian',		
  'St Lucian',		
  'Stateless',		
  'Sudanese',		
  'Surinamese',		
  'Swazi',		
  'Swedish',		
  'Swiss',		
  'Syrian',		
  'Taiwanese',		
  'Tajik',		
  'Tanzanian',		
  'Thai',		
  'Togolese',		
  'Tongan',		
  'Trinidadian',		
  'Tristanian',		
  'Tunisian',		
  'Turkish',		
  'Turkmen',		
  'Turks and Caicos Islander',		
  'Tuvaluan',		
  'Ugandan',		
  'Ukrainian',		
  'Uruguayan',		
  'Uzbek',		
  'Vatican citizen',		
  'Venezuelan',		
  'Vietnamese',		
  'Vincentian',		
  'Wallisian',		
  'Welsh',		
  'Yemeni',		
  'Zambian',		
  'Zimbabwean',		
]


const updateLandlord = () => {
  editlandlordRefForm.value?.validate().then(({ valid }) => {
    if (valid) {

      if(!sessionStorage.getItem("accessToken")){
        router.push('/login')

        return 
      }

      const formData = new FormData()

      formData.append('userId', sessionStorage.getItem("userId"))
      formData.append('landlordData', JSON.stringify(landlordObj.value))

      if(landlordNewImage.value !== null){
        formData.append('landlordImage', landlordNewImage.value)
      }


      axios.post("http://127.0.0.1:8000/prop-app/landlord/update", formData, {
        headers: {
          'Authorization': sessionStorage.getItem('accessToken'),
        },
      }).then(response => {
        if(response.status == 200){
          addTenantAlertSnackbar.value.message = response.data.message
          addTenantAlertSnackbar.value.color = 'success'
          addTenantAlertSnackbar.value.show = true
          resetForm()
          // emit('getSingleLandlord')
        }
      }).catch(error => {
        addTenantAlertSnackbar.value.message = error.response.data.message
        addTenantAlertSnackbar.value.color = 'error'
        addTenantAlertSnackbar.value.show = true
        if(error.response.status === 401){
          refreshUserLogin()
        }
      }) 


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


const fillPhoneCode = () => {
  if(landlordObj.value.landlordCountry !== '' && landlordObj.value.landlordCountry !== null){
    countriesList.value.forEach((ele) => {
      if(ele.country === landlordObj.value.landlordCountry){
        phoneCode.value = "+"+Number(ele.phonecode)
      }
    })
  }
}

watchEffect(fillPhoneCode)

// watchEffect(watchLandlordData)


const resolveImg = () => {
  if(landlordObj.value.landlordImage){
    landlordFormImage.value = "http://127.0.0.1:8000/media/"+landlordObj.value.landlordImage
  }
  else{
    landlordFormImage.value = avatar1
  }
}

watchEffect(resolveImg)



// onMounted(() => {
//   console.log(codes_data)
// })
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Landlord" v-if="landlordObj">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="landlordFormImage"
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
                  v-model="landlordObj.firstName"
                  :rules="[requiredValidator]"
                  label="First Name*"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="4"
                cols="12"
              >
              <AppTextField
                  v-model="landlordObj.lastName"
                  :rules="[requiredValidator]"
                  label="Last Name*"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordObj.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email*"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordObj.password"
                  :rules="[requiredValidator, passwordValidator]"
                  label="Password*"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordObj.landlordAddress"
                  label="Address*"
                  placeholder="Street/block/city"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppSelect
                  v-model="landlordObj.landlordCountry"
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
                  v-model="landlordObj.zipcode"
                  :rules="[requiredValidator]"
                  label="Zip Code*"

                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordObj.contactNumber"
                  :rules="[requiredValidator, integerValidator]"
                  label="Contact*"
                  :prefix="phoneCode"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppSelect
                  v-model="landlordObj.nationality"
                  :rules="[requiredValidator]"
                  label="Nationality*"
                  :items="nationalityList"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordObj.landlordCompanyName"
                  label="Company Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordObj.landlordContactPerson"
                  label="Contact Person Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol 
              cols="12"
              md="4">
                <AppSelect
                  v-model="landlordObj.status"
                  label="Status *"
                  :rules="[requiredValidator]"
                  :items="['Active', 'Inactive']"
                />
              </VCol>
              <!-- 👉 Address -->

              <VCol
                cols="12"
                md="4"
              >
              <AppSelect
                  v-model="landlordObj.type"
                  label="Type*"
                  :rules="[requiredValidator]"
                  :items="['Demo', 'Paid']"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4"
              >
                <AppTextField
                  v-model="landlordObj.bankName"
                  label="Bank Name *"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordObj.bankAccountNo"
                  label="Bank Account No. *"
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordObj.bankIbanNo"
                  label="Bank Iban No. *"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordObj.vatId"
                  label="VAT Id"
                />
              </VCol>


              <!-- <VCol
                cols="12"
                md="4"
              >
                <label>Logo Image</label>
                <VFileInput
                  ref="landlordLogoRef"
                  label="company Logo"
                  density="compact"
                  @change="getLdLogo"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <label>Landlord ID document</label>
                <VFileInput
                  ref="landlordDocumentRef"
                  label="Id Proof document"
                  density="compact"
                  @change="getLdDoc"
                />
              </VCol> -->


              <!-- <VCol 
              cols="12"
              md="6">
                <AppTextField
                  v-model="landlordObj.comments"
                  label="Comments"
                />
              </VCol> -->


              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click="updateLandlord">
                  Save Changes
                </VBtn>

              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>



  <VSnackbar
    v-model="landlordProfileTabAlert.show"
    transition="fade-transition"
    location="botton center"
    :color="landlordProfileTabAlert.color"
  >
    {{ landlordProfileTabAlert.message }}
  </VSnackbar>
</template>
