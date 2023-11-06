<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { refreshUserLogin } from '@/common/reusing_functions'
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

const tenantRefForm = ref()
const tenantFirstName = ref()
const tenantLastName = ref()
const tenantEmail = ref()
const tenantContactNumber = ref()
const tenantNationality = ref()
const tenantPassword = ref()
const tenantIdNo = ref()
const tenantImage = ref()
const tenantDoc = ref(null)
const tenantStatus = ref()
const addTenantFormImg = ref(avatar1)
const refInputEl = ref()
const addTenantAlertSnackbar = ref({ show: false, message: null, color: null })

const resetForm = () => {
  addTenantFormImg.value = avatar1
  tenantRefForm?.value.reset()
}

const changeAvatar = file => {

  addTenantFormImg.value = URL.createObjectURL(file.target.files[0])
  tenantImage.value = file.target.files[0]
}

// reset avatar image
const resetAvatar = () => {
  addTenantFormImg.value = avatar1
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


const createTenant = () => {
  tenantRefForm.value?.validate().then(({ valid }) => {
    if (valid) {

      if(!sessionStorage.getItem("accessToken")){
        router.push('/login')

        return 
      }

      let tenantData = {
        "userFirstname": tenantFirstName.value,
        "userLastname": tenantLastName.value,
        "contactNumber": tenantContactNumber.value,
        "userNationality": tenantNationality.value,
        "userStatus": tenantStatus.value,
        "userEmail": tenantEmail.value,
        "userPassword": tenantPassword.value,
        "userIdNumber": tenantIdNo.value,
      }

      const formData = new FormData()

      formData.append('userId', sessionStorage.getItem("userId"))
      formData.append('userData', JSON.stringify(tenantData))
      formData.append('userRole', "tenant")

      if(addTenantFormImg.value !== avatar1){
        formData.append('userImage', tenantImage.value)
      }
      if(tenantDoc.value !== null){
        formData.append('userDocument', tenantDoc.value)
      }

      axios.post("http://127.0.0.1:8000/prop-app/users/create", formData, {
        headers: {
          'Authorization': sessionStorage.getItem('accessToken'),
        },
      }).then(response => {
        if(response.status == 201){
          addTenantAlertSnackbar.value.message = response.data.message
          addTenantAlertSnackbar.value.color = 'success'
          addTenantAlertSnackbar.value.show = true
          resetForm()
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


const getTenantDoc = e =>{
  tenantDoc.value = e.target.files[0]
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Add Tenant">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="addTenantFormImg"
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
            ref="tenantRefForm"
            class="mt-6"
          >
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="tenantFirstName"
                  label="First Name"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="tenantLastName"
                  label="Last Name"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="tenantEmail"
                  label="E-mail"
                  type="email"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="tenantPassword"
                  label="Password"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="tenantNationality"
                  label="Nationality"
                  :items="nationalityList"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="tenantContactNumber"
                  label="Phone Number"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Address -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="tenantIdNo"
                  label="ID No."
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="tenantStatus"
                  label="Status"
                  :items="['Active', 'Inactive']"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <label>Doc</label>
                <VFileInput
                  label="Id Proof document"
                  density="compact"
                  @change="getTenantDoc"
                />
              </VCol>


              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click="createTenant">
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

