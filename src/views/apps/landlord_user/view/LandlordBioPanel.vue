<script setup>
import axios from '@axios';

const props = defineProps({
  landlordData: {
    type: Object,
    required: true,
  },
})

const standardPlan = {
  plan: 'Standard',
  price: 99,
  benefits: [
    '10 Users',
    'Up to 10GB storage',
    'Basic Support',
  ],
}

const bioPanelData = ref(props.landlordData)
const isPropertyInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)

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
      bioPanelData.value = response.data.landlord
    }).catch((error) => {
      if(error.response.status === 403){
        refreshUserLogin()
      }
    })

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

const resolveUserRoleVariant = role => {
  if (role === 'subscriber')
    return {
      color: 'warning',
      icon: 'tabler-user',
    }
  if (role === 'author')
    return {
      color: 'success',
      icon: 'tabler-circle-check',
    }
  if (role === 'maintainer')
    return {
      color: 'primary',
      icon: 'tabler-chart-pie-2',
    }
  if (role === 'editor')
    return {
      color: 'info',
      icon: 'tabler-pencil',
    }
  if (role === 'admin')
    return {
      color: 'secondary',
      icon: 'tabler-server-2',
    }
  
  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}

// watchEffect(getSingleLandlord)


</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="bioPanelData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!bioPanelData.avatar ? 'primary' : undefined"
            :variant="!bioPanelData.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="bioPanelData.documents"
              :src="'http://127.0.0.1:8000/media/'+resolveLandlordImage(bioPanelData.documents)"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              <!-- {{ avatarText(bioPanelData.details.landlord_name) }} -->
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h4 mt-4">
            <!-- {{ bioPanelData.details.landlord_name }} -->
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
                <!-- {{ kFormatter(bioPanelData.taskDone) }} -->
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
                <!-- {{ kFormatter(bioPanelData.projectDone) }} -->
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
                  Name:
                  <span class="text-body-1">
                    <!-- {{ bioPanelData.details.landlord_name }} -->
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Email:
                  <!-- <span class="text-body-1">{{ bioPanelData.details.email }}</span> -->
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
                    :color="resolvePropertyStatusVariant(bioPanelData.status)"
                    class="text-capitalize"
                  >
                    {{ bioPanelData.status }}
                  </VChip>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Contact Number:
                  <!-- <span class="text-capitalize text-body-1">{{ bioPanelData.details.contact_number }}</span> -->
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Company Name:
                  <span class="text-body-1">
                    <!-- None -->
                    <!-- {{ bioPanelData.details.company_name }} -->
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Nationality:
                  <!-- <span class="text-body-1">{{ bioPanelData.details.nationality }}</span> -->
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Contact Name:
                  <!-- <span class="text-body-1">{{ bioPanelData.details.contact_name }}</span> -->
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

  <!-- 👉 Edit user info dialog -->

</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
