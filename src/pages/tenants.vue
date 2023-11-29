<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { populatePropertiesList, refreshUserLogin } from '@/common/reusing_functions'
import router from '@/router'
import CardStatisticsGeneratedLeads from '@/views/pages/cards/card-statistics/CardStatisticsGeneratedLeads.vue'
import axios from '@axios'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useTheme } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'


const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors
const tenantPageAlertSnackbar = ref({ show: false, message: null, color: null })
const isTenantsFilterDrawerOpen = ref(false)
const tenantFilterUnits = ref([])
const tenantFilterFloors = ref([])
const filterSelectedUnits = ref()
const filterSelectedUnitFloor = ref()
const filterSelectedProperty = ref()
const filterSelectedNationality = ref()
const filterSelectedStatus = ref()
const filterSelectedRent = ref()
const startDateRange = ref()
const endDateRange = ref()
const tenantsMaxRent = ref()
const tenancyRentSliderMin = ref()
const tenancyRentSliderMax = ref()
const tenantfiltersRef = ref()

const fetchedPropertiesList = ref([])
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const resolveTenantStatusVariant = stat => {

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

const tenantSearchQuery = ref()

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
const clearTenantFilters = () =>{
  tenantfiltersRef.value?.reset()
  isTenantsFilterDrawerOpen.value=false
  tenantFilterFloors.value = []
}

const tenantsFilterCancel = () => {
  tenantfiltersRef.value?.reset()
  isTenantsFilterDrawerOpen.value=false
  tenantFilterFloors.value = []
  getTenantsData()
}

const simpleStatisticsDemoCards = [
  {
    icon: 'tabler-users-group',
    color: 'info',
    title: '13',
    subTitle: 'Tenants Last Month',

    // stat: '13',
    change: '+2.2%',
  },
  {
    icon: 'tabler-user-off',
    color: 'warning',
    title: '8',
    subTitle: 'Blocked Tenants',

    // stat: '8',
    change: '+3.2%',
  },
  {
    icon: 'tabler-user-pause',
    color: 'error',
    title: '2',
    subTitle: 'Disabled Tenants',

    // stat: '8',
    change: '+3.2%',
  },
  {
    icon: 'tabler-file-off',
    color: 'warning',
    title: '3',
    subTitle: 'Expiring Contracts',

    // stat: '8',
    change: '+3.2%',
  },
]

const headers = [
  {
    title: 'NAME',
    key: 'tenant.name',
  },
  {
    title: 'Phone',
    key: 'tenant.contact_number',
  },
  {
    title: 'Unit',
    key: 'unit.unit_name',
  },
  {
    title: 'Unit Floor',
    key: 'unit.unit_floor',
  },
  {
    title: 'Start Date',
    key: 'tenant.tenancy_start',
  },
  {
    title: 'End Date',
    key: 'tenant.tenancy_end',
  },
  {
    title: 'Rent',
    key: 'tenant.rent',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
  },
]


const fetchedTenantsList = ref([])

const goToAddTenantPage = () => {
  router.push("/addtenant")
}


const tenantsSearchedResults = () => {

  if(tenantSearchQuery.value !== null || tenantSearchQuery.value !== ""){

    let queryData = {
      "userId": sessionStorage.getItem('userId'),
      "searchParam" : tenantSearchQuery.value
    }

    axios.get("http://localhost:8000/prop-app/tenant/search", {
      params: queryData,
      headers: {
        'Authorization' : sessionStorage.getItem("accessToken") 
      }
    }).then((response) => {
      fetchedTenantsList.value = response.data.result
    }).catch((error) => {
      if(error.response.status == 403){
        refreshUserLogin()
      }
    })
  }

}


const getTenantsData = () => {
  let queryData = {
    "userId": sessionStorage.getItem("userId"),
  }
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  axios.get("http://127.0.0.1:8000/prop-app/details/tenants", {
    params: queryData,
    headers: {
      'Authorization': sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    console.log(response)
    fetchedTenantsList.value = response.data.tenantsData
    tenancyRentSliderMax.value = response.data.tenancyMaxRent
  }).catch(error => {
    console.log(error)
    if(error.response.status === 403){
      refreshUserLogin()
    }
  })
}

function getFloorUnits(){

if(filterSelectedProperty.value && filterSelectedUnitFloor.value >= 0){
  let sendData = {
    "userId": sessionStorage.getItem("userId"),
  }

  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  sendData['propertyId'] = filterSelectedProperty.value
  sendData['floor'] = filterSelectedUnitFloor.value

  axios.get("http://localhost:8000/prop-app/floors/units", {
    params: sendData,
    headers: {
      'Authorization': sessionStorage.getItem('accessToken'),
    },
  }).then((response) => {
    tenantFilterUnits.value = response.data.units
  }).catch((error) => {
    console.log(error)
    if(error.response.status){
      refreshUserLogin()
    }
  })
}
}

function populateFloorsDropdown(){

if(filterSelectedProperty.value){
  fetchedPropertiesList.value.forEach(element => {
    if(element.propertyId === filterSelectedProperty.value){

      tenantFilterFloors.value = []
      if(element.floors === 0){
        tenantFilterFloors.value.push({
          "text": "ground floor",
          "value": 0,
        })
        
        return
      }
      else{
        for(let i = 0; i < element.floors; i++){

          let key = "floor "+i
          if(i == 0){
            key = "ground floor"
          }
          floorList.value.push({
            "text": key,
            "value": i,
          })
        }
      }
    }
  })
}
}


watchEffect(populateFloorsDropdown)
watchEffect(getFloorUnits)

function getFilteredTenants() {

  let queryData = {
    "userId": sessionStorage.getItem("userId")
  }

  if(filterSelectedProperty.value){
    queryData['property'] = filterSelectedProperty.value
  }
  if(filterSelectedUnitFloor.value){
    queryData['floor'] = filterSelectedUnitFloor.value
  }
  if(filterSelectedUnits.value){
    queryData['unit'] = filterSelectedUnits.value
  }
  if(filterSelectedNationality.value){
    queryData['nationality'] = filterSelectedNationality.value
  }
  if(filterSelectedRent.value){
    queryData['rent'] = filterSelectedRent.value
  }
  if(filterSelectedStatus.value){
    queryData['status'] = filterSelectedStatus.value
  }
  if(startDateRange.value){
    queryData['startDate'] = startDateRange.value
  }
  if(endDateRange.value){
    queryData['endDate'] = endDateRange.value
  }
  

  if(Object.keys(queryData).length > 1){

    axios.get("http://localhost:8000/prop-app/tenants/filter", {
      params: queryData,
      headers: {
        'Authorization' : sessionStorage.getItem("accessToken")
      }
    }).then((response) => {
      console.log("tenants filter", response)
      fetchedTenantsList.value = response.data.result
      isTenantsFilterDrawerOpen.value = true
    }).catch((error) =>{
      if(error.response.status == 403){
        refreshUserLogin()
      }
    })

  }
  else{
    tenantPageAlertSnackbar.message = "Select filters to proceed",
    tenantPageAlertSnackbar.color = "warning",
    tenantPageAlertSnackbar.show = true
    return
  }

}

const resolveTenantImage = (documents) => {
  let image = null
  documents.forEach((ele) => {
    if(ele.document_name == "tenant image"){
      image = ele.image
    }
  })

  return image
}



onMounted(() => {
  getTenantsData()
  populatePropertiesList().then((response) => {
    fetchedPropertiesList.value = response.data.propertiesData
  })
})
</script>



<template>
  <VRow class="match-height">
    <VCol
      v-for="demo in simpleStatisticsDemoCards"
      :key="demo.title"
      cols="12"
      sm="6"
      md="2"
    >
      <VCard>
        <VCardText>
          <VAvatar
            :color="demo.color"
            variant="tonal"
            rounded
            size="42"
          >
            <VIcon :icon="demo.icon" />
          </VAvatar>

          <h2 class="text-h2 mt-3">
            {{ demo.title }}
          </h2>
          <!--
            <p class="mt-1 mb-2">
            {{ demo.stat }}
            </p> 
          -->
          <p class="text-sm text-disabled mt-1 mb-0">
            {{ demo.subTitle }}
          </p>
          <VChip
            :color="demo.color"
            label
          >
            {{ demo.change }}
          </VChip>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Revenue Growth -->
    <!--
      <VCol
      cols="12"
      md="4"
      >
      <CardStatisticsRevenueGrowth />
      </VCol> 
    -->

    <!-- 👉 Generated Leads -->
    <VCol
      cols="12"
      md="4"
    >
      <CardStatisticsGeneratedLeads />
    </VCol>
  </VRow>

  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Tenants">
          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <!--
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
            -->

            <div style="inline-size: 20rem;">
              <AppTextField
                v-model="tenantSearchQuery"
                placeholder="Search"
                density="compact"
                append-inner-icon="tabler-search"
                @keyup.enter="tenantsSearchedResults"
              />
            </div>
            <VSpacer />


            <!-- 👉 Search  -->

            <VBtn
              size="38"
              color="warning"
              prepend-icon="tabler-filter"
              @click="isTenantsFilterDrawerOpen=true"
            />

            <!-- 👉 Export button -->
            <VBtn
              size="38"
              color="info"
              title="download report"
              prepend-icon="tabler-download"
            />



            <!-- 👉 Add user button -->
            <VBtn
              prepend-icon="tabler-plus"
              color="secondary"
              @click="goToAddTenantPage"
            >
              Add Tenants
            </VBtn>
          </VCardText>

          <VDivider />

          <!-- SECTION datatable -->
          <VDataTable
            :headers="headers"
            :items="fetchedTenantsList"
            :items-per-page="10"
          >
            <template #item.tenant.name="{ item }">
              <div class="d-flex align-center">
                <!-- avatar -->
                
                
                <VAvatar
                  size="32"
                  :color="item.raw.documents ? '' : 'primary'"
                  :class="item.raw.documents ? '' : 'v-avatar-light-bg primary--text'"
                  :variant="!item.raw.tenant.name ? 'tonal' : undefined"
                >
                  <VImg
                    v-if="item.raw.documents"
                    :src="'http://127.0.0.1:8000/media/'+resolveTenantImage(item.raw.documents)"
                  />
                  <span v-else>{{ avatarText(item.raw.tenant.name) }}</span>
                </VAvatar>  
               
               

                <div class="d-flex flex-column ms-3">
                  <RouterLink 
                    class="d-block font-weight-medium text--primary text-truncate"
                    :to="{ name: 'viewtenant-id', params: { id: item.raw.tenant.tenant_id } }"
                  >
                    {{ item.raw.tenant.name }}
                  </RouterLink>
                  <!-- <small>{{ item.raw.post }}</small> -->
                </div>
              </div>
            </template>


            <template #item.tenant.user_status="{ item }">
              <VChip
                :color="resolveTenantStatusVariant(item.raw.tenant.user_status).color"
                size="small"
              >
                {{ resolveTenantStatusVariant(item.raw.tenant.user_status).text }}
              </VChip>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-1">
                <IconBtn @click="editPropertyItem(item.raw.propertyId)">
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
      </VCol>
    </VRow>
  </section>

  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="isTenantsFilterDrawerOpen"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Filter Tenants"
      @click="clearTenantFilters"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="tenantfiltersRef">
            <VRow>
              <!-- 👉 Property -->
              <VCol cols="12">
                <AppSelect
                  v-model="filterSelectedProperty"
                  label="Select Property"
                  :items="fetchedPropertiesList"
                  item-title="propertyName"
                  item-value="propertyId"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="filterSelectedUnitFloor"
                  label="Select Floor"
                  :items="tenantFilterFloors"
                  item-title="text"
                  item-value="value"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="filterSelectedUnits"
                  label="Select Unit"
                  :items="tenantFilterUnits"
                  item-title="unit_name"
                  item-value="unit_id"
                />
              </VCol>

              <VCol cols="12">
                <AppDateTimePicker
                  v-model="startDateRange"
                  label="Start Date"
                  :config="{ mode: 'range' }"
                />
              </VCol>

              <VCol cols="12">
                <AppDateTimePicker
                  v-model="endDateRange"
                  label="End Date"
                  :config="{ mode: 'range' }"
                />
              </VCol>

              <VCol cols="12">
                <VSlider
                  v-model="filterSelectedRent"
                  label="Rent"
                  :max="tenancyRentSliderMax"
                  :min="tenancyRentSliderMin"
                  :step="1"
                >
                  <template #append>
                    <AppTextField
                      v-model="filterSelectedRent"
                      type="number"
                      style="inline-size: 100px;"
                    />
                  </template>
                </VSlider>
              </VCol>

              <!-- 👉 Country -->
              <VCol cols="12">
                <AppSelect
                  v-model="filterSelectedNationality"
                  :items="nationalityList"
                  label="Nationality"
                />
              </VCol>


              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect
                  v-model="filterSelectedStatus"
                  label="Select Status"
                  :items="['Active', 'Inactive']"
                />
              </VCol>


              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  class="me-3"
                  @click="getFilteredTenants"
                >
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="tenantsFilterCancel"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>


  <VSnackbar
    v-model="tenantPageAlertSnackbar.show"
    transition="fade-transition"
    location="botton center"
    :color="tenantPageAlertSnackbar.color"
  >
    {{ tenantPageAlertSnackbar.message }}
  </VSnackbar>
</template>


<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
