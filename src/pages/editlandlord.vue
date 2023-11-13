<script setup>
import { emailValidator, integerValidator, passwordValidator, requiredValidator } from '@/@core/utils/validators'
import router from '@/router'
import axios from '@axios'
import avatar1 from '@images/avatars/avatar-14.png'


const accountData = {
  avatarImg: avatar1,
  firstName: 'john',
  lastName: 'Doe',
  email: 'johnDoe@example.com',
  org: 'Pixinvent',
  phone: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  zip: '10001',
  country: 'USA',
  language: 'English',
  timezone: '(GMT-11:00) International Date Line West',
  currency: 'USD',
}

const addlandlordRefForm = ref()
const landlordFormImg = ref(avatar1)
const refInputEl = ref()
const addTenantAlertSnackbar = ref({ show: false, message: null, color: null })
const landlordImage = ref(null)
const landlordLogo = ref(null)
const landlordDocument = ref(null)

const landlordDetailsToAdd = ref({
'firstName' : '',
'lastName' : '',
'email' : '',
'password' : '',
'nationality' : '',
'contactNumber' : '',
'landlordContactPerson' : '',
'landlordCompanyName' : '',
'status' : '',
'type': '',
'bankName': '',
'bankAccountNo': '',
'bankIbanNo': '',
'vatId': '',
'comments': '',
'landlordCharges': ''
})


const resetForm = () => {
  landlordFormImg.value = avatar1
  addlandlordRefForm?.value.reset()
}

const changeAvatar = file => {

  landlordFormImg.value = URL.createObjectURL(file.target.files[0])
  landlordImage.value = file.target.files[0]
}

// reset avatar image
const resetAvatar = () => {
  landlordFormImg.value = avatar1
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


const createLandlord = () => {
  addlandlordRefForm.value?.validate().then(({ valid }) => {
    if (valid) {

      // console.log(landlordDetailsToAdd.value)
      // console.log(landlordDocument.value, landlordImage.value, landlordLogo.value)
      if(!sessionStorage.getItem("accessToken")){
        router.push('/login')

        return 
      }

      const formData = new FormData()

      formData.append('userId', sessionStorage.getItem("userId"))
      formData.append('userData', JSON.stringify(landlordDetailsToAdd.value))

      if(landlordFormImg.value !== avatar1 && landlordImage.value !== null){
        formData.append('userImage', landlordImage.value)
      }
      if(landlordDocument.value !== null){
        formData.append('userDocument', landlordDocument.value)
      }
      if(landlordLogo.value !== null){
        formData.append('userCompanyLogo',landlordLogo.value)
      }

      axios.post("http://127.0.0.1:8000/prop-app/landlord/create", formData, {
        headers: {
          'Authorization': sessionStorage.getItem('accessToken'),
        },
      }).then(response => {
        if(response.status == 201){
          addTenantAlertSnackbar.value.message = response.data.message
          addTenantAlertSnackbar.value.color = 'success'
          addTenantAlertSnackbar.value.show = true
          resetForm()
          router.push('/landlord')
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

const getLdLogo = e =>{
  landlordLogo.value = e.target.files[0]
}

const getLdDoc = e =>{
  landlordDocument.value = e.target.files[0]
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Add Landlord">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="landlordFormImg"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="tabler-cloud-upload"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
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
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="tabler-refresh"
                  class="d-sm-none"
                />
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
            ref="addlandlordRefForm"
            class="mt-6"
          >
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="4"
                cols="12"
              >
              <AppTextField
                  v-model="landlordDetailsToAdd.firstName"
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
                  v-model="landlordDetailsToAdd.lastName"
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
                  v-model="landlordDetailsToAdd.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email*"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToAdd.password"
                  :rules="[requiredValidator, passwordValidator]"
                  label="Password*"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="4"
              >
              <AppSelect
                  v-model="landlordDetailsToAdd.nationality"
                  :rules="[requiredValidator]"
                  label="Nationality*"
                  :items="nationalityList"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToAdd.contactNumber"
                  :rules="[requiredValidator, integerValidator]"
                  label="Contact*"
                />
              </VCol>

              <!-- 👉 Address -->

              <VCol
                cols="12"
                md="4"
              >
              <AppSelect
                  v-model="landlordDetailsToAdd.type"
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
                  v-model="landlordDetailsToAdd.bankName"
                  label="Bank Name *"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordDetailsToAdd.bankAccountNo"
                  label="Bank Account No. *"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordDetailsToAdd.bankIbanNo"
                  label="Bank Iban No. *"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol 
              cols="12"
              md="4">
                <AppSelect
                  v-model="landlordDetailsToAdd.status"
                  label="Status *"
                  :rules="[requiredValidator]"
                  :items="['Active', 'Inactive']"
                />
              </VCol>


              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToAdd.landlordAddress"
                  label="Address*"
                  placeholder="Street/block/city"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToAdd.landlordCompanyName"
                  label="Company Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToAdd.landlordContactPerson"
                  label="Contact Person Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToAdd.landlordCharges"
                  label="Charges*"
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordDetailsToAdd.vatId"
                  label="VAT Id"
                />
              </VCol>


              <VCol
                cols="12"
                md="4"
              >
                <label>Logo Image</label>
                <VFileInput
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
                  label="Id Proof document"
                  density="compact"
                  @change="getLdDoc"
                />
              </VCol>


              <VCol 
              cols="12"
              md="6">
                <AppTextField
                  v-model="landlordDetailsToAdd.comments"
                  label="Comments"
                />
              </VCol>


              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click="createLandlord">
                  Create
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VSnackbar
    v-model="addTenantAlertSnackbar.show"
    transition="fade-transition"
    location="botton center"
    :color="addTenantAlertSnackbar.color"
  >
    {{ addTenantAlertSnackbar.message }}
  </VSnackbar>
</template>

