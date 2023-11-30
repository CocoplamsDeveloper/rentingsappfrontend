

<script setup>
import router from '@/router'
import CrmRevenueGrowth from '@/views/dashboards/crm/CrmRevenueGrowth.vue'
import EcommerceExpensesRadialBarCharts from '@/views/dashboards/ecommerce/EcommerceExpensesRadialBarCharts.vue'
import InvoiceList from '@/views/dashboards/invoice/InvoiceList.vue'

const simpleStatisticsDemoCards = [
  {
    icon: 'tabler-cash',
    color: 'info',
    title: 'Pending Due',
    subTitle: 'This Month',
    stat: '12800 KWD',
    change: '-12.2%',
    bgc: "#fff",
  },
  {
    icon: 'tabler-cash',
    color: 'error',
    title: 'Overdue',
    subTitle: 'Till Date',
    stat: '800 KWD',
    change: '+25.2%',
    bgc: "#fff",
  },
  {
    icon: 'tabler-cash',
    color: 'success',
    title: 'Payments',
    subTitle: 'This Month',
    stat: '52600 KWD',
    change: '+25.2%',
    bgc: "#fff",
  },

  // {
  //   icon: 'tabler-chart-bar',
  //   color: 'info',
  //   title: 'Overdue',
  //   subTitle: 'Till Date',
  //   stat: '4,673 KWD',
  //   change: '+25.2%',
  // },
]

onMounted(()=>{
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')
  }
})
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Revenue Growth -->
    <VCol
      cols="12"
      md="8"
      lg="4"
    >
      <CrmRevenueGrowth />
    </VCol>

    <VCol
      v-for="demo in simpleStatisticsDemoCards"
      :key="demo.title"
      cols="12"
      sm="6"
      md="4"
      lg="2"
    >
      <VCard :color="demo.bgc">
        <VCardText>
          <VAvatar
            :color="demo.color"
            variant="tonal"
            rounded
            size="42"
          >
            <VIcon :icon="demo.icon" />
          </VAvatar>

          <h5 class="text-h5 mt-4">
            {{ demo.title }}
          </h5>
          <p class="text-sm text-disabled my-1 mb-0">
            {{ demo.subTitle }}
          </p>
          <p class="mb-3">
            {{ demo.stat }}
          </p>
          <VChip
            color="disabled"
            label
          >
            {{ demo.change }}
          </VChip>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="4"
      sm="6"
      lg="2"
    >
      <EcommerceExpensesRadialBarCharts />
    </VCol>

    <!-- 👉 Invoice -->
    <VCol
      cols="12"
      md="12"
    >
      <InvoiceList />
    </VCol>
  </VRow>
</template>
