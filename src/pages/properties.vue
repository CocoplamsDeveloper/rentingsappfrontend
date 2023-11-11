


<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { refreshUserLogin } from '@/common/reusing_functions'

import router from '@/router'

import PropertyEditDrawer from '@/views/apps/property/PropertyEditDrawer.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import CardStatisticsSalesOverview from '@/views/pages/cards/card-statistics/CardStatisticsSalesOverview.vue'
import axios from '@axios'
import { VDataTable } from 'vuetify/labs/VDataTable'

 

const userListStore = useUserListStore()
const propertySearchQuery = ref()
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const totalPage = ref(1)
const totalUsers = ref(0)
const fetchedPropertiesList = ref([])
const propPageAlertSnackbar = ref({ show: false, message: null, color: null })
const propertyEditDialog = ref(false)
const statusToggleSwitch = ref(true)
const propertyEditFormImage = ref()
const updatedImageFile = ref()
const imageUpdateField = ref()
const selectedItem = ref("one data")
const isEditPropertyDrawerVisible = ref(false)
const deletePropertyConfirm = ref(false)
const deletePropertyDialogText = ref()
const propertyToBeDeleted = ref()

const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
]

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})
 
// Headers
const headers = [
  {
    title: 'NAME',
    key: 'details.property_name',
  },
  {
    title: 'NUMBER',
    key: 'details.property_number',
  },
  {
    title: 'TYPE',
    key: 'details.property_type',
  },
  {
    title: 'BUILT YEAR',
    key: 'details.built_year',
  },
  {
    title: 'SIZE(in sqmtrs)',
    key: 'details.area_insqmtrs',
  },
  {
    title: 'STATUS',
    key: 'details.property_status',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
  },
]

const propertyTypeOptions = [
  'Residential',
  'Commercial',
]


const roles = ref([])
const plans = ref([])
const status = ref([])

const editedItemObj = ref({
  "propertyId": '',
  "propertyName": '',
  "propertyType": '',
  "propertyNumber": '',
  "propertyCity": '',
  "propertyStreet": '',
  "propertyBlock": '',
  "propertyStatus": '',
  "propertyCivilId": '',
  "propertyImage": '',
  "propertyDescription": '',
  "propertySize": '',
  "propertyBuiltYear": '',
  "propertyBuyValue": '',
  "propertySaleValue": '',
  "propertyCountry": '',
})
 
const editPropertyItem = item => {
  isEditPropertyDrawerVisible.value = true 
  selectedItem.value = item
  
  if (!sessionStorage.getItem("accessToken")) {
    router.push('/login')
    
    return
  }
  axios.get("http://127.0.0.1:8000/prop-app/property/" + item, {
    params: { "userId": sessionStorage.getItem('userId') },
    headers: {
      "Authorization": sessionStorage.getItem("accessToken"),
    },
  }).then((response) => {
    prefillPropertyEditForm(response.data.property_data[0])
  }).catch((error) => {
    if (error.response.status === 401) {
      refreshUserLogin()
    }
  })

  // propertyEditDialog.value = true
}

// watch(selectedItem, (newValue, oldValue) => {
//   console.log({ selectedItem: newValue })
// })

const prefillPropertyEditForm = property => {
  let currentProp = editedItemObj.value
  currentProp.propertyId = property.property_id
  currentProp.propertyName = property.property_name
  currentProp.propertyType = property.property_type
  currentProp.propertySize = property.area_insqmtrs
  currentProp.propertyNumber = property.property_number
  currentProp.propertyStatus = property.property_status
  currentProp.propertyBuiltYear = property.built_year
  currentProp.propertyCity = property.City
  currentProp.propertyStreet = property.Street
  currentProp.propertyBlock = property.Block
  currentProp.propertyCivilId = property.property_civil_id
  currentProp.propertyDescription = property.property_description
  currentProp.propertyImage = property.property_image
  currentProp.propertySaleValue = property.selling_price
  currentProp.propertyBuyValue = property.buying_price
  currentProp.propertyCountry = property.governate
}

const deletePropertyItem = item => {

  fetchedPropertiesList.value.forEach((ele) => {
    if(ele.propertyId == item){
      deletePropertyDialogText.value = "Are you sure you want to delete "+ele.details.property_name+ " Property"
    }
  })
  propertyToBeDeleted.value = item
  deletePropertyConfirm.value = true
}

const deletePropertyApi = () => {

  let queryData = {
    "userId" : sessionStorage.getItem("userId"),
    "propertyId": propertyToBeDeleted.value
  }
  axios.delete("http://localhost:8000/prop-app/property/delete", {
    params: queryData,
    headers: {
      'Authorization' : sessionStorage.getItem("accessToken")
    }
  }).then((response) => {
    if(response.status == 200){
      deletePropertyConfirm.value = false
      propPageAlertSnackbar.message = response.data.message
      propPageAlertSnackbar.color = "success"
      propPageAlertSnackbar.show = true
      getAllProperties()
    }
  }).catch((error) => {
    if(error.response.status == 403){
      refreshUserLogin()
    }
  })

}
 
const resolveStatusVariant = stat => {

  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'active')
    return {
      color: 'success',
      text: 'Active',
    }
  if (statLowerCase === 'inactive')
    return {
      color: 'secondary',
      text: 'Inactive',
    }
   
  return {
    color: 'primary',
    text: 'No Status',
  }
}
 

 
// 👉 List
const userListMeta = [
  {
    icon: 'tabler-building',
    color: 'primary',

    // title: 'Properties',
    stats: '10',
    subtitle: 'Properties',
  },
  {
    icon: 'tabler-home',
    color: 'primary',

    // title: 'Properties',
    stats: '89',
    subtitle: 'Total Units',
  },
  {
    icon: 'tabler-user-check',
    color: 'success',

    // title: 'Active Users',
    stats: '76',

    // percentage: -14,
    subtitle: 'Total Tenants',
  },
  {
    icon: 'tabler-cash',
    color: 'success',

    // title: 'Active Users',
    stats: '20k KD',

    // percentage: -14,
    subtitle: 'Revenue',
  },

  // {
  //   icon: 'tabler-cash',
  //   color: 'success',

  //   // title: 'Active Users',
  //   stats: '20K KWD',

  //   // percentage: -14,
  //   subtitle: 'Payments',
  // },
]




function goToAddPage(){
  router.push("/add-property")
}

function getAllProperties(){

  let queryData =  {
    "userId": sessionStorage.getItem('userId'),
  }
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')
    
    return 
  }

  axios.get("http://127.0.0.1:8000/prop-app/alllandlord/props", {
    params: queryData,
    headers: {
      'Authorization': sessionStorage.getItem("accessToken"),
    }, 
  }).then(response => {
    console.log(response)
    fetchedPropertiesList.value = response.data.propertiesData
  }).catch(error => {
    if(error.response.status === 401){
      refreshUserLogin()
    }
  })
}



function propertySearchResults(){
    if(propertySearchQuery.value !== null || propertySearchQuery.value !== ''){

      let queryData = {
        "userId": sessionStorage.getItem("userId"),
        "searchParam" : propertySearchQuery.value
      }

      axios.get("http://127.0.0.1:8000/prop-app/property/search", {
        params: queryData,
        headers: {
          'Authorization' : sessionStorage.getItem("accessToken")
        }
      }).then((response) => {
        fetchedPropertiesList.value = response.data.result
      }).catch((error) => {
        if(error.response.status == 403){
          refreshUserLogin()
        }
      })
    }
}



onMounted(() => {
  getAllProperties()
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
        lg="2"
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
      <VCol>
        <CardStatisticsSalesOverview />
      </VCol>
      <VCol cols="12">
        <VCard title="Properties">
          <!-- 👉 Filters -->
          <!-- <VCardText>
            <VRow> -->
              <!-- 👉 Select Role -->
              <!-- <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedRole"
                  label="Select Type"
                  :items="roles"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol> -->
              <!-- 👉 Select Plan -->
              <!-- <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedPlan"
                  label="Select Built Year"
                  :items="plans"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol> -->
              <!-- 👉 Select Status -->
              <!-- <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedStatus"
                  label="Select Status"
                  :items="status"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol> -->
            <!-- </VRow>
          </VCardText> -->
 
          <VDivider />
 
          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <!-- <div class="me-3 d-flex gap-3">
              <AppSelect
                :model-value="options.itemsPerPage"
                :items="[
                  { value: 10, title: '10' },
                  { value: 25, title: '25' },
                  { value: 50, title: '50' },
                  { value: 100, title: '100' },
                  { value: -1, title: 'All' },
                ]"
                style="width: 6.25rem;"
                @update:model-value="options.itemsPerPage = parseInt($event, 10)"
              />
            </div> -->

            <div style="inline-size: 15rem;">
                <AppTextField
                  v-model="propertySearchQuery"
                  placeholder="Search"
                  density="compact"
                  append-inner-icon="tabler-search"
                  @keyup.enter="propertySearchResults"
                />
              </div>

            <VSpacer />
 
            <div class="d-flex align-center flex-wrap gap-4">
              <!-- 👉 Search  -->

 
              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn>
 
              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="goToAddPage"
              >
                Add Property
              </VBtn>
            </div>
          </VCardText>
 
          <VDivider />
 
          <!-- SECTION datatable -->
          <VDataTable
            :headers="headers"
            :items="fetchedPropertiesList"
            :items-per-page="10"
          >
            <template #item.details.property_name="{ item }">
              <div class="d-flex align-center">
                <!-- avatar -->
                <VAvatar
                  size="32"
                  :color="item.raw.details.property_image ? '' : 'primary'"
                  :class="item.raw.details.property_image ? '' : 'v-avatar-light-bg primary--text'"
                  :variant="!item.raw.details.property_image ? 'tonal' : undefined"
                >
                  <VImg
                    v-if="item.raw.details.property_image"
                    :src="'http://127.0.0.1:8000/media/'+item.raw.details.property_image"
                  />
                  <span v-else>{{ avatarText(item.raw.details.property_name) }}</span>
                </VAvatar>

                <div class="d-flex flex-column ms-3">
                  <RouterLink
                    class="d-block font-weight-medium text--primary text-truncate" 
                    :to="{ name: 'viewproperty-id', params: { id: item.raw.propertyId } }"
                  >
                    {{ item.raw.details.property_name }}
                  </RouterLink>
                  <!-- <small>{{ item.raw.post }}</small> -->
                </div>
              </div>
            </template>

            <!-- status -->
            <template #item.details.property_status="{ item }">
              <VChip
                :color="resolveStatusVariant(item.raw.details.property_status).color"
                size="small"
              >
                {{ resolveStatusVariant(item.raw.details.property_status).text }}
              </VChip>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-1">
                <!--
                  <IconBtn @click="isEditPropertyDrawerVisible = true">
                  <VIcon icon="mdi-pencil-outline" />
                  </IconBtn>  
                -->
               
                <!-- <IconBtn @click="editPropertyItem(item.raw.propertyId)"> -->
                <IconBtn @click="editPropertyItem(item.raw.propertyId)">
                  <VIcon icon="mdi-pencil-outline" />
                </IconBtn>
                <IconBtn @click="deletePropertyItem(item.raw.propertyId)">
                  <VIcon icon="mdi-delete-outline" />
                </IconBtn>
              </div>
            </template>
          </VDataTable>
          <!-- SECTION -->
        </VCard>
      </vcol>
    </vrow>
  </section>


  <VDialog 
    v-model="deletePropertyConfirm" 
    :width="500"
  >
    <DialogCloseBtn @click="deletePropertyConfirm = !deletePropertyConfirm" />
    <VCard title="Delete">
      <VCardText>
        {{ deletePropertyDialogText }}
      </VCardText>

      <VCardText class="d-flex justify-end">
        <VBtn 
          :style="{marginRight:'10px'}"
          @click="deletePropertyConfirm = false"
        >
          No
        </VBtn>
        <VBtn @click="deletePropertyApi">
          Yes
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VSnackbar
    v-model="propPageAlertSnackbar.show"
    transition="fade-transition"
    location="botton center"
    :color="propPageAlertSnackbar.color"
  >
    {{ propPageAlertSnackbar.message }}
  </VSnackbar>
  <PropertyEditDrawer
    v-model:isDrawerOpen="isEditPropertyDrawerVisible"
    :edited-item-obj="editedItemObj"
    @get-all-properties="getAllProperties"
  />
</template>
 
 <style lang="scss">
  .app-user-search-filter {
    inline-size: 31.6rem;
  }

  .text-capitalize {
    text-transform: capitalize;
  }

  .user-list-name:not(:hover) {
    color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
  }
 </style> 
