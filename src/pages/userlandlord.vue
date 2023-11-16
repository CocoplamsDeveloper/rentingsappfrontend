<script setup>
import { refreshUserLogin } from '@/common/reusing_functions'
import LandlordBioPanel from '@/views/apps/landlord_user/view/LandlordBioPanel.vue'
import LandlordTabDocuments from '@/views/apps/landlord_user/view/LandlordTabDocuments.vue'
import LandlordTabProfile from '@/views/apps/landlord_user/view/LandlordTabProfile.vue'
import PropertyTabBillingsPlans from '@/views/apps/property/view/PropertyTabBillingsPlans.vue'
import PropertyTabNotifications from '@/views/apps/property/view/PropertyTabNotifications.vue'
import axios from "@axios"
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



function getSingleLandlord(){
    let queryData = {
      "userId" :  sessionStorage.getItem("userId")
    }

    axios.get("http://localhost:8000/prop-app/landlord/"+sessionStorage.getItem("userId"), {
      params: queryData,
      headers: {
        'Authorization': sessionStorage.getItem("accessToken")
      }
    }).then((response) => {
      console.log(response)
      landlordData.value = response.data.landlord
      fillCurrentDetails(response.data.landlord)
    }).catch((error) => {
      if(error.response.status === 403){
        refreshUserLogin()
      }
    })

}




function fetchLandlordsStats(){

let queryData = {
  "userId" : sessionStorage.getItem('userId')
}

axios.get("http://localhost:8000/prop-app/landlord-page/stats", {
  params: queryData,
  headers: {
    'Authorization' : sessionStorage.getItem('accessToken')
  }
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
      lg="4"
    >
      <LandlordBioPanel />
    </VCol>

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

        
        <VWindowItem>
          <PropertyTabBillingsPlans />
        </VWindowItem> 
       

        
        <VWindowItem>
          <PropertyTabNotifications />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</section>
</template>
