<script setup>
import { emailValidator, integerValidator, passwordValidator, requiredValidator } from '@/@core/utils/validators'
import router from '@/router'
import avatar1 from '@images/avatars/avatar-14.png'
import axios from 'axios'

const route = useRoute()

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

const editlandlordRefForm = ref()
const landlordFormImg = ref(avatar1)
const refInputEl = ref()
const addTenantAlertSnackbar = ref({ show: false, message: null, color: null })
const landlordNewImage = ref(null)
const landlordNewLogo = ref(null)
const landlordNewDocument = ref(null)
const landlordCurrentImage = ref(null)
const landlordCurrentLogo = ref(null)
const landlordCurrentDocument = ref(null)
const fetchedLandlord = ref({})
const landlordLogoRef = ref()
const landlordDocumentRef = ref()


const landlordDetailsToEdit = ref({
'landlordId': '',
'userId': '',
'firstName' : '',
'lastName' : '',
'email' : '',
'password' : '',
'nationality' : '',
'contactNumber' : '',
'landlordContactPerson' : '',
'landlordCompanyName' : '',
'landlordAddress': '',
'status' : '',
'type': '',
'bankName': '',
'bankAccountNo': '',
'bankIbanNo': '',
'vatId': '',
'comments': '',
'landlordCharges': ''
})

const fillCurrentDetails = (landlord) => {
  let ld = landlordDetailsToEdit.value
  let data = landlord.details
  let documents = landlord.documents
  let name = data.landlord_name.split(' ')
  ld.firstName = name[0]
  ld.lastName = name[1]
  ld.landlordId = landlord.landlordId
  ld.userId = data.user_id
  ld.email = data.email
  ld.password = data.password,
  ld.nationality = data.nationality,
  ld.contactNumber = data.contact_number,
  ld.landlordContactPerson = data.contact_name,
  ld.landlordCompanyName = data.company_name,
  ld.status = landlord.status,
  ld.type = data.landlord_type,
  ld.bankName = data.bank_account_details.name,
  ld.bankAccountNo = data.bank_account_details.account_no,
  ld.bankIbanNo = data.bank_account_details.iban_no,
  ld.vatId = data.VAT_id,
  ld.comments = data.comments,
  ld.landlordAddress = data.address

  documents.forEach((element) =>{
    if(element.document_name === "user/landlord Image"){
     landlordFormImg.value = "http://localhost:8000/media/"+element.image 
     landlordCurrentImage.value = element.image 
    }
    if(element.document_name === "landlord company logo"){
      if(element.image){
      let t1 = element.image.split('/')
      landlordLogoRef.value = t1[1]
      landlordCurrentLogo.value = element.image
      } 
    }
    if(element.document_name === "landlord document"){
      if(element.document){
      let t2 = element.image.split('/')
      landlordDocumentRef.value = t2[1]
      landlordCurrentDocument.value = element.document
      console.log("line 88",element.document)
      }
    }
  })
}

const resetForm = () => {
  router.push('/landlord')
}

const changeAvatar = file => {

  landlordFormImg.value = URL.createObjectURL(file.target.files[0])
  landlordNewImage.value = file.target.files[0]
}

// reset avatar image
const resetAvatar = () => {
  if(landlordCurrentImage.value){
    landlordFormImg.value = "http://localhost:8000/media/"+landlordCurrentImage.value
  }
  else{
    landlordFormImg.value = avatar1
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

      // console.log(landlordDetailsToEdit.value)
      // console.log(landlordDocument.value, landlordImage.value, landlordLogo.value)
      if(!sessionStorage.getItem("accessToken")){
        router.push('/login')

        return 
      }

      const formData = new FormData()

      formData.append('userId', sessionStorage.getItem("userId"))
      formData.append('landlordData', JSON.stringify(landlordDetailsToEdit.value))

      if(landlordNewImage.value !== null){
        formData.append('landlordImage', landlordNewImage.value)
      }
      if(landlordNewDocument.value !== null){
        formData.append('landlordDocument', landlordNewDocument.value)
      }
      if(landlordNewLogo.value !== null){
        formData.append('landlordLogo',landlordNewLogo.value)
      }

      axios.post("http://127.0.0.1:8000/prop-app/landlord/update", formData, {
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

function getSingleLandlord(landlordId){
    let queryData = {
      "userId" :  sessionStorage.getItem("userId")
    }

    axios.get("http://localhost:8000/prop-app/landlord/"+landlordId, {
      params: queryData,
      headers: {
        'Authorization': sessionStorage.getItem("accessToken")
      }
    }).then((response) => {
      fetchedLandlord.value = response.data.landlord
      fillCurrentDetails(response.data.landlord)
    }).catch((error) => {
      if(error.response.status === 403){
        refreshUserLogin()
      }
    })

}

const getLdLogo = e =>{
  landlordNewLogo.value = e.target.files[0]
}

const getLdDoc = e =>{
  landlordNewDocument.value = e.target.files[0]
}


onMounted(() => {
  getSingleLandlord(route.params.id)
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Edit Landlord">
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
                  v-model="landlordDetailsToEdit.firstName"
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
                  v-model="landlordDetailsToEdit.lastName"
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
                  v-model="landlordDetailsToEdit.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email*"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToEdit.password"
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
                  v-model="landlordDetailsToEdit.nationality"
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
                  v-model="landlordDetailsToEdit.contactNumber"
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
                  v-model="landlordDetailsToEdit.type"
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
                  v-model="landlordDetailsToEdit.bankName"
                  label="Bank Name *"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordDetailsToEdit.bankAccountNo"
                  label="Bank Account No. *"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordDetailsToEdit.bankIbanNo"
                  label="Bank Iban No. *"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol 
              cols="12"
              md="4">
                <AppSelect
                  v-model="landlordDetailsToEdit.status"
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
                  v-model="landlordDetailsToEdit.landlordAddress"
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
                  v-model="landlordDetailsToEdit.landlordCompanyName"
                  label="Company Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>


              <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToEdit.landlordContactPerson"
                  label="Contact Person Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- <VCol
                cols="12"
                md="4"
              >
              <AppTextField
                  v-model="landlordDetailsToEdit.landlordCharges"
                  label="Charges*"
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol> -->

              <VCol 
              cols="12"
              md="4">
                <AppTextField
                  v-model="landlordDetailsToEdit.vatId"
                  label="VAT Id"
                />
              </VCol>


              <VCol
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
              </VCol>


              <VCol 
              cols="12"
              md="6">
                <AppTextField
                  v-model="landlordDetailsToEdit.comments"
                  label="Comments"
                />
              </VCol>


              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click="updateLandlord">
                  Save Changes
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Go back
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
