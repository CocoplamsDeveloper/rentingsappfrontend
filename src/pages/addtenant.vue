<script setup>
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue'
import { emailValidator, integerValidator, requiredValidator } from '@/@core/utils/validators'
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
const nationalIdExpireRef = ref()
const passportExpRef = ref()
const addTenantFormImg = ref(avatar1)
const isFamilyDocsDialogVisible = ref(false)
const refInputEl = ref()
const addTenantAlertSnackbar = ref({ show: false, message: null, color: null })
const accordCheck = ref(true)
const memberType = ref(null)
const tenantFamilyMembers = ref([])
const accordianModel = ref([])
const familyMemberDocs = ref([])
const memberIndex = ref()
const tenantDetails = ref({
  "firstName": '',
  "lastName": '',
  "email": '',
  "contactNumber": '',
  "nationalId": '',
  "nationalIdExpire": '',
  "passportNo": '',
  "passportExpireDate": '',
  "workAddress": '',
  "maritalStatus": '',
  "tenantImage": null,
  "tenantIdDocument": null,
  "passportDocument": null,
  "status": ''
})

const resetForm = () => {
  addTenantFormImg.value = avatar1
  tenantRefForm?.value.reset()
  nationalIdExpireRef?.value.reset()
  passportExpRef?.value.reset()
}

const changeAvatar = file => {

  addTenantFormImg.value = URL.createObjectURL(file.target.files[0])
  tenantDetails.value.tenantImage = file.target.files[0]
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

const addMembers = () => {
  if(memberType.value){
    tenantFamilyMembers.value.push({
    "type": memberType.value,
    "name" : '',
    "nationality": '',
    "passportNo": '',
    "documents": [],
  })
    memberType.value = null
  }

}

watchEffect(addMembers)


const deleteMember = (index) => {
  tenantFamilyMembers.value.splice(index, 1)
}

const openMemberPanel = () => {
  if(tenantDetails.value.maritalStatus === "Married"){
    accordCheck.value = false
    accordianModel.value.push("member")
  }
  else{
    accordCheck.value = true
    accordianModel.value.splice(0, 1)
  }
}

const afterTenantCreation = () => {
  tenantFamilyMembers.value.forEach((ele, index) => {
    tenantFamilyMembers.value.splice(index, 1)
  })
}


watchEffect(openMemberPanel)

const checkFamilyData = () => {
  let checkVar = false
  tenantFamilyMembers.value.forEach((ele) => {
    if(ele.name === "" || !ele.name || ele.name === null){
      checkVar = true
    }
    if(ele.passportNo === "" || !ele.passportNo || ele.passportNo === null){
      checkVar = true
    }
    if(ele.nationality === "" || !ele.nationality || ele.nationality === null){
      checkVar = true
    }

  })

  if(checkVar){
    return false
  }
  else{
    return true
  }
}

const tenantApiCall = () => {
  if(!sessionStorage.getItem("accessToken")){
        router.push('/login')

        return 
      }

      let tenantData = {
        "tenant" : tenantDetails.value,
        "tenantFamily" : tenantFamilyMembers.value
      }

      const formData = new FormData()

      formData.append('userId', sessionStorage.getItem("userId"))
      formData.append('tenantData', JSON.stringify(tenantData))
      
      tenantFamilyMembers.value.forEach((ele)=>{
        ele.documents.forEach((doc) => {
          formData.append(doc.name, doc.document)
        })
      })
      if(addTenantFormImg.value !== avatar1){
        formData.append('tenantImage', tenantDetails.value.tenantImage)
      }
      if(tenantDetails.value.tenantIdDocument !== null){
        formData.append('tenantDocument', tenantDetails.value.tenantIdDocument)
      }

      axios.post("http://127.0.0.1:8000/prop-app/tenant/create", formData, {
        headers: {
          'Authorization': sessionStorage.getItem('accessToken'),
        },
      }).then(response => {
        if(response.status == 201){
          addTenantAlertSnackbar.value.message = response.data.message
          addTenantAlertSnackbar.value.color = 'success'
          addTenantAlertSnackbar.value.show = true
          if(tenantDetails.value.maritalStatus === "Married"){
            afterTenantCreation()
            resetForm()
          }
          else{
            resetForm()
          }
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


const createTenant = () => {


  if(tenantDetails.value.maritalStatus === "Married"){

    tenantRefForm.value?.validate().then(({ valid }) => {
        if(valid){
          let res = checkFamilyData()
          if(!res){
            addTenantAlertSnackbar.value.message = "Kindly member details!"
            addTenantAlertSnackbar.value.color = 'warning'
            addTenantAlertSnackbar.value.show = true
            return
          }
          else{
            tenantApiCall();
          }
        }
      })
  }
  else{
    tenantRefForm.value?.validate().then(({ valid }) => {  
    if (valid) {
      tenantApiCall()
    }
  })
  }
}

const tenantFamilyDocs = (index) => {
  isFamilyDocsDialogVisible.value = true
  memberIndex.value = index
  familyMemberDocs.value = tenantFamilyMembers.value[index].documents
}

const addDocToMemberArray = async () => {
  let task = new Promise((resolve, reject) => {
    let obj = tenantFamilyMembers.value[memberIndex.value]
    obj.documents = familyMemberDocs.value
    console.log(familyMemberDocs.value, obj)
    resolve(true)
  })
  await task;
  familyMemberDocs.value = []
  isFamilyDocsDialogVisible.value = false
}

const deleteDocRecord = (index) => {
  familyMemberDocs.value.splice(index, 1)
}

const insertDocumentRecord = () => {
  familyMemberDocs.value.push({
    "name": '',
    "document": null
  })
}

const downloadMemberDoc = (index) => {
  let obj = familyMemberDocs.value[index]
  const link = document.createElement('a');
  const downloadUrl = window.URL.createObjectURL(new Blob([obj.document]))
  link.href = downloadUrl;
  link.setAttribute('download', obj.document.name); //or any other extension
  document.body.appendChild(link);
  link.click();
}

const getNationalIdDoc = e =>{
  tenantDetails.value.tenantIdDocument = e.target.files[0]
}

const getPassportDoc = e =>{
  tenantDetails.value.passportDocument = e.target.files[0]
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
                md="4"
                cols="12"
              >
                <AppTextField
                  v-model="tenantDetails.firstName"
                  label="First Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="4"
                cols="12"
              >
                <AppTextField
                  v-model="tenantDetails.lastName"
                  label="Last Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="tenantDetails.email"
                  label="E-mail*"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="tenantDetails.nationality"
                  label="Nationality*"
                  :items="nationalityList"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="tenantDetails.contactNumber"
                  label="Phone Number*"
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="tenantDetails.status"
                  label="Status*"
                  :items="['Active', 'Inactive']"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="tenantDetails.workAddress"
                  label="Work Address*"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="tenantDetails.maritalStatus"
                  label="Marital Status*"
                  :items="['Single', 'Married']"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="tenantDetails.nationalId"
                  label="National Id No."
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppDateTimePicker
                  ref="nationalIdExpireRef"
                  v-model="tenantDetails.nationalIdExpire"
                  label="National Id Expire Date."
                />
              </VCol>

              <VCol
                cols="12"
                md="4">
                <label>National Id Document</label>
                <VFileInput
                  accept="application/*"
                  label="Document"
                  @change="getNationalIdDoc"
                />
              </VCol>


              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="tenantDetails.passportNo"
                  label="Passport No."
                />
              </VCol>
              
              <VCol
                cols="12"
                md="4"
              >
                <AppDateTimePicker
                  ref="passportExpRef"
                  v-model="tenantDetails.passportExpireDate"
                  label="Passport Expire Date"
                />
              </VCol>

              <VCol
                cols="12"
                md="4">
                <label>Passport Document</label>
                <VFileInput
                  accept="application/*"
                  label="Document"
                  @change="getPassportDoc"
                />
              </VCol>



              
              <VCol
                cols="12"
              >
                <VExpansionPanels variant="accordion" :disabled="accordCheck" v-model="accordianModel">
                  <VExpansionPanel value="member">
                  <VExpansionPanelTitle>
                    Add members
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <VSpacer/>
                    <VRow>
                      <VCol
                        cols="12"
                        md="4"
                        >
                        <AppSelect
                          v-model="memberType"
                          label="Member Type"
                          :items="['Spouse', 'Child']"
                      />
                      </VCol>


                    </VRow>
                    <VForm>
                    <VRow v-for="(row, rowIndex) in tenantFamilyMembers" :key="rowIndex">

                      <VCol
                        cols="12"
                        md="2">
                        <AppTextField
                          v-model="row.name"
                          label="Name"
                          :rules="[requiredValidator]"
                          required
                      />
                      </VCol>
                      <VCol
                        cols="12"
                        md="2">
                        <AppTextField
                          v-model="row.passportNo"
                          label="Passport No."
                          :rules="[requiredValidator]"
                      />
                      </VCol>
                      <VCol
                        cols="12"
                        md="2">
                        <AppSelect
                          v-model="row.nationality"
                          :items="nationalityList"
                          label="Nationality"
                          :rules="[requiredValidator]"
                      />
                      </VCol>
                      <VCol
                        cols="12"
                        md="2"
                      >
                        <VBtn
                        size="36"
                        color="primary"
                        prepend-icon="tabler-files"
                        @click="tenantFamilyDocs(rowIndex)"
                        :style="{marginTop: '24px'}"
                        />
                        <VBtn
                        size="36"
                        color="warning"
                        prepend-icon="tabler-trash"
                        @click="deleteMember(rowIndex)"
                        :style="{marginTop: '24px', marginLeft: '10px'}"
                        />
                      </VCol>
                    </VRow>
                  </VForm>
                  </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </VCol>


              <!-- <VCol
                cols="12"
                md="4"
              >
                <label>Doc</label>
                <VFileInput
                  label="Id Proof document"
                  density="compact"
                  @change="getTenantDoc"
                />
              </VCol> -->


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
  
  <VDialog
    v-model="isFamilyDocsDialogVisible"
    max-width="600"
  >

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isFamilyDocsDialogVisible = !isFamilyDocsDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Member documents">
        <VBtn
        size="28"
        color="success"
        prepend-icon="tabler-plus"
        :style="{marginLeft: 'auto', marginTop:'-10px', marginRight:'35px'}"
        @click="insertDocumentRecord">
        </VBtn>
      <VCardText>
        <VRow v-for="(doc, index) in familyMemberDocs" :key="index">
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField
              v-model="doc.name"
              label="Document Name"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
          <label>Document</label>
            <VFileInput
              label="select"
              accept="application/*"
              @change="(e) => {
                doc.document = e.target.files[0]
              }"
            />
          </VCol>

          <VCol
          cols="12"
          md="4"
          sm="6"
          >
          <VBtn
          size="36"
          color="success"
          prepend-icon="tabler-download"
          @click="downloadMemberDoc(index)"
          :style="{marginTop: '24px'}"
          >
          </VBtn>
          <VBtn
          size="36"
          color="warning"
          prepend-icon="tabler-trash"
          @click="deleteDocRecord(index)"
          :style="{marginTop: '24px', marginLeft: '10px'}"
          />
        </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
        @click="addDocToMemberArray">
          Add
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>


  <VSnackbar
    v-model="addTenantAlertSnackbar.show"
    transition="fade-transition"
    location="botton center"
    :color="addTenantAlertSnackbar.color"
  >
    {{ addTenantAlertSnackbar.message }}
  </VSnackbar>
</template>

