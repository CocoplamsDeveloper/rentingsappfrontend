<!--
  <template>
  <div>
  <VCard
  class="mb-6"
  title="Kick start your project 🚀"
  >
  <VCardText>All the best for your new project.</VCardText>
  <VCardText>
  Please make sure to read our <a
  href="https://demos.pixinvent.com/vuexy-vuejs-admin-template/documentation/"
  target="_blank"
  rel="noopener noreferrer"
  class="text-decoration-none"
  >
  Template Documentation
  </a> to understand where to go from here and how to use our template.
  </VCardText>
  </VCard>

  <VCard title="Want to integrate JWT? 🔒">
  <VCardText>We carefully crafted JWT flow so you can implement JWT with ease and with minimum efforts.</VCardText>
  <VCardText>Please read our  JWT Documentation to get more out of JWT authentication.</VCardText>
  </VCard>
  </div>
  </template> 
-->

<script setup>
import router from '@/router'
import CrmActiveProject from '@/views/dashboards/crm/CrmActiveProject.vue'
import CrmActivityTimeline from '@/views/dashboards/crm/CrmActivityTimeline.vue'
import CrmAnalyticsSales from '@/views/dashboards/crm/CrmAnalyticsSales.vue'
import CrmBrowserStates from '@/views/dashboards/crm/CrmBrowserStates.vue'
import CrmEarningReportsYearlyOverview from '@/views/dashboards/crm/CrmEarningReportsYearlyOverview.vue'
import CrmProjectStatus from '@/views/dashboards/crm/CrmProjectStatus.vue'
import CrmRecentTransactions from '@/views/dashboards/crm/CrmRecentTransactions.vue'
import CrmRevenueGrowth from '@/views/dashboards/crm/CrmRevenueGrowth.vue'
import EcommerceExpensesRadialBarCharts from '@/views/dashboards/ecommerce/EcommerceExpensesRadialBarCharts.vue'
import InvoiceList from '@/views/dashboards/invoice/InvoiceList.vue'

const simpleStatisticsDemoCards = [
  {
    icon: 'tabler-currency-dollar',
    color: 'info',
    title: 'Pending Due',
    subTitle: 'This Month',
    stat: '12800 KWD',
    change: '-12.2%',
    bgc: "#fff",
  },
  {
    icon: 'tabler-currency-dollar',
    color: 'error',
    title: 'Overdue',
    subTitle: 'Till Date',
    stat: '800 KWD',
    change: '+25.2%',
    bgc: "#fff",
  },
  {
    icon: 'tabler-currency-dollar',
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

    <!--
      <VCol
      cols="12"
      md="4"
      sm="6"
      lg="2"
      >
      <CrmSalesAreaCharts />
      </VCol>

      <VCol
      cols="12"
      md="4"
      sm="6"
      lg="2"
      >
      <CrmSessionsBarWithGapCharts />
      </VCol> 
    -->

    <!-- 👉 Earning Reports -->
    <VCol
      cols="12"
      md="8"
    >
      <InvoiceList />
    </VCol>

    <!-- 👉 Earning Reports -->
    <VCol
      cols="12"
      md="8"
    >
      <CrmEarningReportsYearlyOverview />
    </VCol>

    <!-- 👉 Sales -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmAnalyticsSales />
    </VCol>

    <!-- 👉 Browser States -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmBrowserStates />
    </VCol>

    <!-- 👉 Project Status -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmProjectStatus />
    </VCol>

    <!-- 👉 Active Project -->
    <VCol
      cols="12"
      md="4"
    >
      <CrmActiveProject />
    </VCol>

    <!-- 👉 Recent Transactions -->
    <VCol
      cols="12"
      md="6"
    >
      <CrmRecentTransactions />
    </VCol>

    <!-- 👉 Active timeline -->
    <VCol
      cols="12"
      md="6"
    >
      <CrmActivityTimeline />
    </VCol>
  </VRow>
</template>
