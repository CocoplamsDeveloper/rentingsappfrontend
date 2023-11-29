<script setup>
import { refreshUserLogin } from '@/common/reusing_functions'
import LandlordTabDocuments from '@/views/apps/landlord_user/view/LandlordTabDocuments.vue'
import LandlordTabProfile from '@/views/apps/landlord_user/view/LandlordTabProfile.vue'
// import PropertyTabBillingsPlans from '@/views/apps/property/view/PropertyTabBillingsPlans.vue'
// import PropertyTabNotifications from '@/views/apps/property/view/PropertyTabNotifications.vue'
import axios from "@axios"
import { avatarText } from '@core/utils/formatters'
import { onMounted } from 'vue'

// import { useUserListStore } from '@/views/apps/property/usePropertyListStore'

// const userListStore = useUserListStore()
const route = useRoute()

const landlordData = ref({})
const landlordsCount = ref()
const activeLandlords = ref()
const totalProperties = ref()
const totalUnits = ref()
const userTab = ref(null)
const landlordFormImg = ref()
const landlordDocumentsList = ref([])
const landlordDetails = ref({})

const tabs = [
  {
    icon: 'tabler-user-check',
    title: 'Profile',
  },

  {
    icon: 'tabler-file',
    title: 'Documents',
  },

  // {
  //   icon: 'tabler-building',
  //   title: 'Invoices',
  // },

  // {
  //   icon: 'tabler-bell',
  //   title: 'Maintenance',
  // },

]

const userListMeta = [
  {
    icon: 'tabler-building',
    color: 'success',
    // title: 'Active Users',
    stats: totalProperties,
    // percentage: -14,
    subtitle: 'Total Properties',
  },
  {
    icon: 'tabler-home-2',
    color: 'success',
    // title: 'Pending Users',
    stats: totalUnits,
    // percentage: +42,
    subtitle: 'Total Units',
  },
  {
    icon: 'tabler-user',
    color: 'primary',
    // title: 'Landlords',
    stats: landlordsCount,
    subtitle: 'Total Tenants',
  },
  {
    icon: 'tabler-user-check',
    color: 'info',
    // title: 'Paid Users',
    stats: activeLandlords,
    // percentage: +18,
    subtitle: 'Total Users',
  }
]

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
'landlordCountry': '',
'zipcode': '',
'status' : '',
'type': '',
'bankName': '',
'bankAccountNo': '',
'bankIbanNo': '',
'vatId': '',
'landlordCharges': '',
'landlordImage' : '',
'landlordLogo' : '',
'landlordDocument': '',
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
  ld.landlordCountry = data.country,
  ld.zipcode = data.zipcode
  ld.vatId = data.VAT_id,
  ld.comments = data.comments,
  ld.landlordAddress = data.address

  documents.forEach((element) =>{
    if(element.document_name === "user Image"){
    if(element.image){
      ld.landlordImage = element.image
    }
    }
    if(element.document_name === "landlord company logo"){
      if(element.image){
      ld.landlordLogo = element.image
      } 
    }
    if(element.document_name === "landlord document"){
      if(element.document){
      ld.landlordDocument = element.document
      }
    }
  })
}



async function getSingleLandlord(){
    let queryData = {
      "userId" :  sessionStorage.getItem("userId")
    }

    try {
const response = await axios.get("http://localhost:8000/prop-app/landlord/" + sessionStorage.getItem("userId"), {
params: queryData,
headers: {
'Authorization': sessionStorage.getItem("accessToken")
}
})
console.log(response)
landlordData.value = response.data.landlord
landlordDetails.value = response.data.landlord.details
fillCurrentDetails(response.data.landlord)
} catch (error) {
if (error.response.status === 403) {
refreshUserLogin()
}
}

}

const resolvePropertyStatusVariant = stat => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'
  
  return 'primary'
}

const resolveLandlordImage = (documents) => {
  let imageURL = null
  if(documents !== null && documents.length > 0){
  documents.forEach((element)=>{
    if(element.document_name === "user Image"){
      imageURL = element.image
    }
  })
  return imageURL
}
}


function fetchLandlordsStats(){

let queryData = {
  "userId" : sessionStorage.getItem('userId')
}

axios.get("http://localhost:8000/prop-app/landlord-page/stats", {
  params: queryData,
  headers: {
    'Authorization' : sessionStorage.getItem('accessToken')
  },
  withCredentials:true
}).then((response) => {
  if(response.status == 200){
    let data = response.data.pageData
    landlordsCount.value = data.landlords
    activeLandlords.value = data.activeLandlords
    totalProperties.value = data.properties
    totalUnits.value = data.units
  }
}).catch((error) => {
  if(error.response.status == 403){
    refreshUserLogin()
  }
})
}

const resolveStartDate = (data) => {
  let current = new Date(data)
  let month = current.getMonth()
  month = month + 1 
  let localDate = current.getFullYear()+"-"+ month +"-"+ current.getDate()
  return localDate
  
}

const resolvePeriod = (year, month) =>{
  if(month == 0){
    return year+ " " + 'year'
  }
  else{
    return year+" "+month+"months"
  }

}



onMounted(() => {
  getSingleLandlord()
  fetchLandlordsStats()
})




</script>


<template>
<section>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h4">
                  {{ meta.stats }}
                </h6>
                <span :class="meta.percentage > 0 ? 'text-success' : 'text-error'"> {{ meta.percentage > 0 ? '+' : '' }} {{ meta.percentage }}</span>
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              :icon="meta.icon"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
</section>
<section>
  <VRow v-if="landlordData">

    <VCol
    cols="12"
      md="5"
      lg="4">
    <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="landlordData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!landlordData.avatar ? 'primary' : undefined"
            :variant="!landlordData.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="landlordData.documents"
              :src="'http://127.0.0.1:8000/media/'+resolveLandlordImage(landlordData.documents)"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(landlordDetails.landlord_name) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h4 mt-4" >
            {{ landlordDetails.landlord_name }}
          </h6>

          <!-- 👉 Role chip -->
          <!--
            <VChip
            label
            :color="resolveUserRoleVariant(props.propertyData.role).color"
            size="small"
            class="text-capitalize mt-3"
            >
            {{ props.propertyData.role }}
            </VChip> 
          -->
        </VCardText>

        <VCardText class="d-flex justify-center flex-wrap mt-3">
          <!-- 👉 Done task -->
          <div class="d-flex align-center me-8">
            <VAvatar
              :size="38"
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
            >
              <VIcon icon="tabler-calendar" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ resolveStartDate(landlordDetails.subscription_start_date) }}
              </h6>
              <span class="text-sm">Start Date</span>
            </div>
          </div>

          <!-- 👉 Done Project -->
          <div class="d-flex align-center me-4">
            <VAvatar
              :size="38"
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
            >
              <VIcon icon="tabler-activity" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                {{ resolvePeriod(landlordDetails.time_period_year, landlordDetails.time_period_months) }}
              </h6>
              <span class="text-sm">Validity Period</span>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Details -->
        <VCardText>
          <p class="text-sm text-uppercase text-disabled">
            Details
          </p>

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Name:
                  <span class="text-body-1" >
                    {{ landlordDetails.landlord_name }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Email:
                  <span class="text-body-1" >{{ landlordDetails.email }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Status:

                  <VChip
                    label
                    size="small"
                    :color="resolvePropertyStatusVariant(landlordData.status)"
                    class="text-capitalize"
                  >
                    {{ landlordData.status }}
                  </VChip>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Contact Number:
                  <span class="text-capitalize text-body-1">{{ landlordDetails.contact_number }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Company Name:
                  <span class="text-body-1">
                    <!-- None -->
                    {{ landlordDetails.company_name }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Nationality:
                  <span class="text-body-1">{{ landlordDetails.nationality }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Contact Name:
                  <span class="text-body-1">{{ landlordDetails.contact_name }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <!-- <VCardText class="d-flex justify-center">
          <VBtn
            variant="elevated"
            class="me-4"
            @click="isPropertyInfoEditDialogVisible = true"
          >
            Edit
          </VBtn>

          <VBtn
            variant="tonal"
            color="error"
          >
            Suspend
          </VBtn>
        </VCardText> -->
      </VCard>
    </VCol>
  </VRow>
</VCol>
    <!-- <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <LandlordBioPanel :landlord-data="landlordData"/>
    </VCol> -->

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            :size="18"
            :icon="tab.icon"
            class="me-1"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <LandlordTabProfile :landlord-details-to-edit="landlordDetailsToEdit" @get-single-landlord="getSingleLandlord"/>
        </VWindowItem>

        
        <VWindowItem>
          <LandlordTabDocuments/>
        </VWindowItem>

        
        <!-- <VWindowItem>
          <PropertyTabBillingsPlans />
        </VWindowItem>  -->
       

        
        <!-- <VWindowItem>
          <PropertyTabNotifications />
        </VWindowItem> -->
      </VWindow>
    </VCol>
  </VRow>
</section>
</template>
