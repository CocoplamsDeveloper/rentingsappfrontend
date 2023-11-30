<script setup>
import { ref } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';

const propertyUnitsList = ref([])

const props = defineProps({
  unitsList: {
    type: Array,
    required: true
  }
})

const headers = [
  {
    title: 'NAME',
    key: 'unit.unit_name',
  },
  {
    title: 'type',
    key: 'unit.unit_type',
  },
  {
    title: 'Floor',
    key: 'unit.unit_floor'
  },
  {
    title: 'Status',
    key: 'status',
  },
]

const resolveUnitsStatusVariant = stat => {

const statLowerCase = stat.toLowerCase()
if (statLowerCase === 'vacant')
  return {
    color: 'success',
    text: 'Vacant',
  }
if (statLowerCase === 'occupied')
  return {
    color: 'secondary',
    text: 'Occupied',
  }
if (statLowerCase === 'under maintenance')
  return {
    color: 'warning',
    text: 'Under Maintenance',
  }

return {
  color: 'primary',
  text: 'No Status',
}
}



</script>

<template>
  <VRow>
    <!-- 👉 Current Plan -->
    <VCol cols="12">
      <VCard title="Units" v-if="props.unitsList">
        <VDivider />
        <VDataTable
          :items="props.unitsList"
          :headers="headers"
          :items-per-page="10"

        >
        <template #item.status="{ item }">
              <VChip
                :color="resolveUnitsStatusVariant(item.raw.status).color"
                size="small"
              >
                {{ resolveUnitsStatusVariant(item.raw.status).text }}
              </VChip>
        </template>

        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

</template>

<!-- <style lang="scss">
.billing-address-table {
  tr {
    td:first-child {
      inline-size: 148px;
    }
  }
}
</style> -->
