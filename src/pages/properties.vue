


<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { integerValidator, requiredValidator } from '@/@core/utils/validators'
import { refreshUserLogin } from '@/common/reusing_functions'

import router from '@/router'

import PropertyEditDrawer from '@/views/apps/property/PropertyEditDrawer.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import CardStatisticsSalesOverview from '@/views/pages/cards/card-statistics/CardStatisticsSalesOverview.vue'
import axios from '@axios'
import { VDataTable } from 'vuetify/labs/VDataTable'

 

const userListStore = useUserListStore()
const searchQuery = ref('')
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
const isAssignUnitDialogVisible = ref(false)

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
  isAssignUnitDialogVisible.value = true 
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
  }).then(response => {
    prefillPropertyEditForm(response.data.property_data[0])
  }).catch(error => {
    if (error.response.status === 401) {
      refreshUserLogin()
    }
  })

  // propertyEditDialog.value = true
}

watch(selectedItem, (newValue, oldValue) => {
  console.log({ selectedItem: newValue })
})

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

  if(property.property_status === "Inactive"){
    statusToggleSwitch.value = false
  }
  else{
    statusToggleSwitch.value = true
  }
  propertyEditFormImage.value ='http://127.0.0.1:8000/media/'+property.property_image
}

const deleteItem = item => {
  editedIndex.value = userList.value.indexOf(item)
  editedItem.value = { ...item }
  deleteDialog.value = true
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

function updatedImageUpload(e){

  // console.log(editedItemObj.value.propertyImage, e.target.files[0])

  let img = e.target.files[0]
  let imgSize = img/1000
  if(imgSize > 2048){
    propPageAlertSnackbar.value.message = "Image size should be less then 2MB"
    propPageAlertSnackbar.value.color = "error"
    propPageAlertSnackbar.value.show = true
    propertyEditFormImage.value = 'http://127.0.0.1:8000/media/'+editedItemObj.value.propertyImage
    imageUpdateField.value?.reset()

    return
  }
  propertyEditFormImage.value = URL.createObjectURL(e.target.files[0])
  updatedImageFile.value = e.target.files[0]
}


function imageFieldChecker(){
  propertyEditFormImage.value = 'http://127.0.0.1:8000/media/'+editedItemObj.value.propertyImage
}

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

function updateProperty(property){

  property = JSON.parse(property)
  let propertyUpdatedStatus = null
  if(statusToggleSwitch.value){
    propertyUpdatedStatus = "Active"
  }
  else{
    propertyUpdatedStatus = "Inactive"
  }

  let updatedProperty = {
    "propertyId": property.propertyId,
    "propertyName": property.propertyName,
    "governateName": property.propertyCountry,
    "propertyCity": property.propertyCity,
    "propertyStreet": property.propertyStreet,
    "propertyBlock": property.propertyBlock,
    "propertyNumber": property.propertyNumber,
    "propertyBuiltYear": property.propertyBuiltYear,
    "propertyType": property.propertyType,
    "propertyStatus": propertyUpdatedStatus,
    "propertySize": property.propertySize,
    "propertySaleValue": property.propertySaleValue,
    "propertyBuyValue": property.propertyBuyValue,
    "propertyCivilId": property.propertyCivilId,
    "propertyDescription": property.propertyDescription,
  }
  const formData = new FormData()

  formData.append('userId', sessionStorage.getItem('userId'))
  formData.append('data', JSON.stringify(updatedProperty))
  
  let imgstr = propertyEditFormImage.value.split("media/")
  imgstr = imgstr[1]
  if(imgstr !== property.propertyImage){
    formData.append('updatedImage', updatedImageFile.value)
  }

  axios.post('http://127.0.0.1:8000/prop-app/property/update', formData, {
    headers: {
      'Authorization': sessionStorage.getItem("AccessToken"),  
    },

  }).then(response => {
    propPageAlertSnackbar.value.message = response.data.message
    propPageAlertSnackbar.value.color = "success"
    propPageAlertSnackbar.value.show = true
    propertyEditDialog.value = false
    getAllProperties()
  }).catch(error => {
    propPageAlertSnackbar.value.message = error.response.data.message
    propPageAlertSnackbar.value.color = "error"
    propPageAlertSnackbar.value.show = true
    if(error.response.status === 401){
      refreshUserLogin()
    }
  })
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
        <VCard title="Search Filter">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol
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
              </VCol>
              <!-- 👉 Select Plan -->
              <VCol
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
              </VCol>
              <!-- 👉 Select Status -->
              <VCol
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
              </VCol>
            </VRow>
          </VCardText>
 
          <VDivider />
 
          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3 d-flex gap-3">
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
            </div>
            <VSpacer />
 
            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
              <!-- 👉 Search  -->
              <div style="inline-size: 10rem;">
                <AppTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>
 
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
                  <IconBtn @click="isAssignUnitDialogVisible = true">
                  <VIcon icon="mdi-pencil-outline" />
                  </IconBtn>  
                -->
               
                <!-- <IconBtn @click="editPropertyItem(item.raw.propertyId)"> -->
                <IconBtn @click="editPropertyItem(item.raw)">
                  <VIcon icon="mdi-pencil-outline" />
                </IconBtn>
                <IconBtn @click="deleteItem(item.raw.propertyId)">
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
    v-model="propertyEditDialog"
    max-width="600px"
  >
    <VCard>
      <VCardTitle>
        <span :style="{marginTop:'5px'}">Edit Property</span>
      </VCardTitle>

      <VCol
        cols="12"
        sm="6"
        md="8"
      >
        <VCard
          width="490px"
          :style="{marginLeft:'40px', marginRight:'15px' , marginTop:'-5px'}"
        >
          <VImg
            :src="propertyEditFormImage"
            alt="No image"
            cover
          />

          <VCardItem>
            <p>Click below to change/add Image</p>
            <VFileInput
              ref="imageUpdateField"
              prepend-icon="tabler-camera"
              label="Image"
              accept="image/*"
              density="compact"
              clearable
              @click:clear="imageFieldChecker"
              @change="updatedImageUpload"
            />
          </VCardItem>
        </VCard>
      </VCol>

      <VCardText>
        {{ editedItemObj.property_name }}
        <VContainer>
          <VRow>
            <!-- full_name -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertyName"
                label="Property Name"
                :rules="[requiredValidator]"
              />
            </VCol>

            <!-- email -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertyNumber"
                label="Property Number"
                :rules="[requiredValidator]"
              />
            </VCol>

            <!-- salary -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VSelect
                v-model="editedItemObj.propertyType"
                :items="propertyTypeOptions"
                label="PropertyType"
                :rules="[requiredValidator]"
              />
            </VCol>

            <!-- age -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertySize"
                label="Property Size"
                :rules="[integerValidator,requiredValidator]"
              />
            </VCol>

            <!-- start date -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertyCity"
                label="PropertyCity"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertyBuiltYear"
                label="Property Built Year"
                :rules="[integerValidator,requiredValidator]"
              />
            </VCol>


            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VSelect
                v-model="editedItemObj.propertyCountry"
                :items="countryList"
                label="Country"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertyStreet"
                label="Property Street"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertyBlock"
                label="Property Block"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertyCivilId"
                label="Civil/Registered No"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertySaleValue"
                label="Property Sale Value"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VTextField
                v-model="editedItemObj.propertyBuyValue"
                label="Property Buy Value"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="8"
            >
              <VTextField
                v-model="editedItemObj.propertyDescription"
                label="Property Description"
              />
            </VCol>

            <!-- status -->
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VSwitch
                v-model="statusToggleSwitch"
                label="Property Status"
              />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>

      <VCardActions>
        <VSpacer />

        <VBtn
          color="error"
          variant="outlined"
          @click="propertyEditDialog=false"
        >
          Cancel
        </VBtn>

        <VBtn
          color="success"
          variant="elevated"
          @click="updateProperty(JSON.stringify(editedItemObj))"
        >
          Save
        </VBtn>
      </VCardActions>
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
    v-model:isDrawerOpen="isAssignUnitDialogVisible"
    :selected-item="selectedItem"
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
