<script setup>
import axios from "@axios"
import { VDataTable } from 'vuetify/labs/VDataTable'
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const smsVerificationNumber = ref('+1(968) 819-2547')
const isTwoFactorDialogOpen = ref(false)
const landlordDocumentsList = ref([])

// Recent devices Headers
const recentDeviceHeader = [
  {
    title: 'ID',
    key: 'browser',
  },
  {
    title: 'NAME',
    key: 'device',
  },
  {
    title: 'ACTION',
    key: 'location',
  },
]

const getDocuments = () => {
  let queryData = {
    "userId" : sessionStorage.getItem('userId')
  }

  axios.get("http://localhost:8000/prop-app/landlord/docs",{
    params: queryData,
    headers: {
      'Authorizaton' : sessionStorage.getItem("accessToken")
    }
  }).then((response) => {
    landlordDocumentsList.value = response.data.data
  }).catch((error) => {
    
  })
}

const recentDevices = [
  {
    browser: ' Chrome on Windows',
    icon: 'tabler-brand-windows',
    color: 'info',
    device: 'HP Spectre 360',
    location: 'Switzerland',
    activity: '10, July 2021 20:07',
  },
  {
    browser: 'Chrome on iPhone',
    icon: 'tabler-device-mobile',
    color: 'error',
    device: 'iPhone 12x',
    location: 'Australia',
    activity: '13, July 2021 10:10',
  },
  {
    browser: 'Chrome on Android',
    icon: 'tabler-brand-android',
    color: 'success',
    device: 'Oneplus 9 Pro',
    location: 'Dubai',
    activity: '14, July 2021 15:15',
  },
  {
    browser: 'Chrome on MacOS',
    icon: 'tabler-brand-apple',
    color: 'secondary',
    device: 'Apple iMac',
    location: 'India',
    activity: '16, July 2021 16:17',
  },
  {
    browser: 'Chrome on Windows',
    icon: 'tabler-brand-windows',
    color: 'info',
    device: 'HP Spectre 360',
    location: 'Switzerland',
    activity: '20, July 2021 21:01',
  },
  {
    browser: 'Chrome on Android',
    icon: 'tabler-brand-android',
    color: 'success',
    device: 'Oneplus 9 Pro',
    location: 'Dubai',
    activity: '20, July 2021 21:01',
  },
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard>
        <div class="d-flex align-center justify-space-between">
        <VCardText>
          <h4>Documents</h4>
        </VCardText>
        <VBtn
          prepend-icon="tabler-plus"  
          :style="{marginRight: '10px'}"
          >
            Add
        </VBtn>
        </div>
        <VDivider />
        <VDataTable
          :items="landlordDocumentsList"
          :headers="recentDeviceHeader"
          hide-default-footer
        >
          <!-- <template #item.browser="{ item }">
            <div class="d-flex">
              <VIcon
                :icon="item.raw.icon"
                :color="item.raw.color"
                :size="22"
                class="me-3"
              />
              {{ item.raw.browser }}
            </div>
          </template> -->
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

  <!-- 👉 Enable One Time Password Dialog -->
  <TwoFactorAuthDialog
    v-model:isDialogVisible="isTwoFactorDialogOpen"
    :sms-code="smsVerificationNumber"
  />
</template>
