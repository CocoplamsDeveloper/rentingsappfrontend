<script setup>
import PropertyUpdateDialog from '@/components/dialogs/PropertyUpdateDialog.vue';
import {
kFormatter
} from '@core/utils/formatters';

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

console.log(props.landlordData)
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
</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.landlordData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!props.landlordData.avatar ? 'primary' : undefined"
            :variant="!props.landlordData.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.landlordData.documents"
              :src="'http://127.0.0.1:8000/media/'+resolveLandlordImage(props.landlordData.documents)"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              <!-- {{ avatarText(props.landlordData.details.landlord_name) }} -->
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h4 mt-4">
            <!-- {{ props.landlordData.details.landlord_name }} -->
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
                {{ kFormatter(props.landlordData.taskDone) }}
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
                {{ kFormatter(props.landlordData.projectDone) }}
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
                    <!-- {{ props.landlordData.details.landlord_name }} -->
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Email:
                  <!-- <span class="text-body-1">{{ props.landlordData.details.email }}</span> -->
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
                    :color="resolvePropertyStatusVariant(props.landlordData.status)"
                    class="text-capitalize"
                  >
                    {{ props.landlordData.status }}
                  </VChip>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Contact Number:
                  <!-- <span class="text-capitalize text-body-1">{{ props.landlordData.details.contact_number }}</span> -->
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Company Name:
                  <span class="text-body-1">
                    <!-- None -->
                    <!-- {{ props.landlordData.details.company_name }} -->
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Nationality:
                  <!-- <span class="text-body-1">{{ props.landlordData.details.nationality }}</span> -->
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Contact Name:
                  <!-- <span class="text-body-1">{{ props.landlordData.details.contact_name }}</span> -->
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
    <!-- !SECTION -->

    <!-- SECTION Current Plan -->
    <!--
      <VCol cols="12">
      <VCard>
      <VCardText class="d-flex">
      👉 Standard Chip
      <VChip
      label
      color="primary"
      size="small"
      class="font-weight-medium"
      >
      Popular
      </VChip>

      <VSpacer />

      👉 Current Price 
      <div class="d-flex align-center">
      <sup class="text-primary text-sm font-weight-regular">$</sup>
      <h3 class="text-h3 text-primary">
      99
      </h3>
      <sub class="mt-3"><h6 class="text-sm font-weight-regular text-disabled">/ month</h6></sub>
      </div>
      </VCardText>

      <VCardText>
      👉 Price Benefits
      <VList class="card-list">
      <VListItem
      v-for="benefit in standardPlan.benefits"
      :key="benefit"
      >
      <VIcon
      size="12"
      color="#A8AAAE"
      class="me-2"
      icon="tabler-circle"
      />
      <span>{{ benefit }}</span>
      </VListItem>
      </VList>

      👉 Days
      <div class="my-6">
      <div class="d-flex mt-3 mb-2">
      <h6 class="text-base font-weight-medium">
      Days
      </h6>
      <VSpacer />
      <h6 class="text-base font-weight-medium">
      26 of 30 Days
      </h6>
      </div>

      👉 Progress
      <VProgressLinear
      rounded
      rounded-bar
      :model-value="65"
      height="10"
      color="primary"
      />

      <p class="mt-2">
      4 days remaining
      </p>
      </div>

      👉 Upgrade Plan
      <div class="d-flex gap-4">
      <VBtn @click="isUpgradePlanDialogVisible = true">
      Upgrade Plan
      </VBtn>
      <VBtn
      variant="tonal"
      color="default"
      >
      cancel
      </VBtn>
      </div>
      </VCardText>
      </VCard>
      </VCol> 
    -->
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <PropertyUpdateDialog
    v-model:isDialogVisible="isPropertyInfoEditDialogVisible"
    :property-data="props.propertyData"
  />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>