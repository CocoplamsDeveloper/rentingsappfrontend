

<script setup>
import { getFacilities, refreshUserLogin } from '@/common/reusing_functions'
import PropertyTabDetails from '@/views/apps/property/view/PropertyTabDetails.vue'
import PropertyTabDocuments from '@/views/apps/property/view/PropertyTabDocuments.vue'
import PropertyTabInvoices from '@/views/apps/property/view/PropertyTabInvoices.vue'
import PropertyTabUnits from '@/views/apps/property/view/PropertyTabUnits.vue'
import axios from "@axios"
import { avatarText } from '@core/utils/formatters'


// import { useUserListStore } from '@/views/apps/property/usePropertyListStore'

// const userListStore = useUserListStore()
const route = useRoute()

const propertyData = ref({})
const propertyDetails = ref({})
const userTab = ref(null)
const facilityData = ref([])

const tabs = [
  {
    icon: 'tabler-details',
    title: 'Details',
  },

  {
    icon: 'tabler-file',
    title: 'Documents',
  },

  {
    icon: 'tabler-home',
    title: 'Units',
  },

  {
    icon: 'tabler-receipt',
    title: 'Invoices',
  },

]

const resolvePropertyStatusVariant = stat => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'
  
  return 'primary'
}

const resolvePropertyImage = (documents) => {
  let image = null
  documents.forEach(element => {
    if(element.document_name === "property image"){
      image = element.image
    }
  });
  return image
}

const editedPropertyObj = ref({
  "propertyId": '',
  "propertyName": '',
  "propertyType": '',
  "propertyNumber": '',
  "propertyCity": '',
  "propertyStreet": '',
  "propertyBlock": '',
  "propertyStatus": '',
  "propertyLicenseNo": '',
  "propertyImage": '',
  "propertyDescription": '',
  "propertySize": '',
  "propertyBuiltYear": '',
  "propertyBuyValue": '',
  "propertySaleValue": '',
  "propertyCountry": '',
  "propertyZipCode": '',
  "propertyConstructionCost": '',
  "propertyRentType": '',
  "propertyFacilities": '',
  "propertyFloors": '',

})

const prefillPropertyEditForm = property => {
  let currentProp = editedPropertyObj.value
  let details = property.details
  currentProp.propertyId = property.propertyId
  currentProp.propertyName = details.property_name
  currentProp.propertyType = details.property_type
  currentProp.propertySize = details.area_insqmtrs
  currentProp.propertyNumber = details.property_number
  currentProp.propertyStatus = property.status
  currentProp.propertyBuiltYear = details.built_year
  currentProp.propertyCity = details.City
  currentProp.propertyStreet = details.Street
  currentProp.propertyBlock = details.Block
  currentProp.propertyLicenseNo = details.property_civil_id
  currentProp.propertyDescription = details.property_description
  currentProp.propertySaleValue = details.selling_price
  currentProp.propertyBuyValue = details.buying_price
  currentProp.propertyCountry = details.governate
  currentProp.propertyZipCode = details.zip_code
  currentProp.propertyConstructionCost = details.construction_cost
  currentProp.propertyRentType = details.rentType
  currentProp.propertyFacilities = details.facilities_available
  currentProp.propertyFloors = details.floors

  property.documents.forEach((ele)=>{
    if(ele.document_name === "property image")
    currentProp.propertyImage = ele.image
  })

}

const fetchProperty = async () => {

  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  try{
    const response = await axios.get("http://127.0.0.1:8000/prop-app/property/"+Number(route.params.id), {
    params: { "userId": sessionStorage.getItem('userId') },
    headers: {
      "Authorization": sessionStorage.getItem("accessToken"),
    },
  })
    if(response.status == 200){
    console.log(response)
    propertyData.value = response.data.property_data
    propertyDetails.value = response.data.property_data.details
    prefillPropertyEditForm(response.data.property_data)
    }
  }
  catch(error){ 
    if(error.response.status === 403){
      refreshUserLogin()
    }
    console.log(error)
}
}
function createFacCheckboxes(data){
  data.forEach(ele => {
    facilityData.value.push({
      "id" : ele.facility_id,
      "name": ele.name,
      "checked": false
    })
  })
}


onMounted(() => {
  fetchProperty()
  getFacilities().then((res) => {
    if(res.status === 200){
      createFacCheckboxes(res.data.facilities)
    } 
  })

})
</script>

<template>
  <VRow v-if="propertyData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <!-- <PropertyBioPanel :property-data="propertyData"/> -->
      <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="propertyData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!propertyData.avatar ? 'primary' : undefined"
            :variant="!propertyData.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="propertyData.documents"
              :src="'http://127.0.0.1:8000/media/'+resolvePropertyImage(propertyData.documents)"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(propertyDetails.property_name) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h4 mt-4">
            {{ propertyDetails.property_name }}
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
              <VIcon icon="tabler-checkbox" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                <!-- {{ kFormatter(propertyDetails.taskDone) }} -->
              </h6>
              <span class="text-sm">Total Units</span>
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
              <VIcon icon="tabler-briefcase" />
            </VAvatar>

            <div>
              <h6 class="text-h6">
                <!-- {{ kFormatter(propertyDetails.projectDone) }} -->
              </h6>
              <span class="text-sm">Tenants</span>
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
                  Property Name:
                  <span class="text-body-1">
                    {{ propertyDetails.property_name }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Property Type:
                  <span class="text-body-1">{{ propertyDetails.property_type }}</span>
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
                    :color="resolvePropertyStatusVariant(propertyData.status)"
                    class="text-capitalize"
                  >
                    {{ propertyData.status }}
                  </VChip>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Property Number:
                  <span class="text-capitalize text-body-1">{{ propertyDetails.property_number }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Built Year:
                  <span class="text-body-1">
                    {{ propertyDetails.built_year }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Property Size:
                  <span class="text-body-1">{{ propertyDetails.area_insqmtrs }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Country:
                  <span class="text-body-1">{{ propertyDetails.governate }}</span>
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
          <PropertyTabDetails :edited-property-obj="editedPropertyObj"
          :facility-data="facilityData"
          @fetch-property="fetchProperty"/>
        </VWindowItem>

        
        <VWindowItem>
          <PropertyTabDocuments />
        </VWindowItem>

        
        <VWindowItem>
          <PropertyTabUnits />
        </VWindowItem> 
       

        <VWindowItem>
          <PropertyTabInvoices />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

