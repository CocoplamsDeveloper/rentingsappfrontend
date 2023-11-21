<script setup>
import {
avatarText
} from '@core/utils/formatters';

const props = defineProps({
  propertyData: {
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

const isPropertyInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)
const property = ref(props.propertyData)
// const propertyId = ref(property.propertyId)
// const propertyDetails = ref(property.details)
// const propertyDocuments = ref(property.documents)
// const propertyStatus = ref(property.status)



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
      <VCard v-if="property">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!property.avatar ? 'primary' : undefined"
            :variant="!property.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="property.documents"
              :src="'http://127.0.0.1:8000/media/'+resolvePropertyImage(property.documents)"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(property.details.property_name) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h4 mt-4">
            {{ property.details.property_name }}
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
                    {{ property.details.property_name }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Property Type:
                  <span class="text-body-1">{{ property.details.property_type }}</span>
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
                    :color="resolvePropertyStatusVariant(property.status)"
                    class="text-capitalize"
                  >
                    {{ property.status }}
                  </VChip>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Property Number:
                  <span class="text-capitalize text-body-1">{{ property.details.property_number }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Built Year:
                  <span class="text-body-1">
                    {{ property.details.built_year }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Property Size:
                  <span class="text-body-1">{{ property.details.area_insqmtrs }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Country:
                  <span class="text-body-1">{{ property.details.governate }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center">
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
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
