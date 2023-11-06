<script setup>
import { hexToRgb } from '@layouts/utils'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const series = [78]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  
  return {
    chart: {
      sparkline: { enabled: true },
      parentHeightOffset: 0,
      type: 'radialBar',
    },
    colors: [currentTheme.warning],
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '65%' },
        track: {
          strokeWidth: '45%',
          background: `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '22px',
            color: `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`,
            fontWeight: 600,
            offsetY: -5,
          },
        },
      },
    },
    grid: {
      show: false,
      padding: { bottom: 5 },
    },
    stroke: { lineCap: 'round' },
    labels: ['Progress'],
    responsive: [
      {
        breakpoint: 1442,
        options: {
          chart: { height: 140 },
          plotOptions: {
            radialBar: {
              dataLabels: { value: { fontSize: '18px' } },
              hollow: { size: '60%' },
            },
          },
        },
      },
      {
        breakpoint: 1370,
        options: { chart: { height: 120 } },
      },
      {
        breakpoint: 1280,
        options: {
          chart: { height: 150 },
          plotOptions: {
            radialBar: {
              dataLabels: { value: { fontSize: '18px' } },
              hollow: { size: '70%' },
            },
          },
        },
      },
      {
        breakpoint: 960,
        options: {
          chart: { height: 250 },
          plotOptions: {
            radialBar: {
              hollow: { size: '70%' },
              dataLabels: { value: { fontSize: '18px' } },
            },
          },
        },
      },
    ],
  }
})
</script>

<template>
  <VCard>
    <VCardText>
      <!--
        <div class="mb-n2">
        <h5 class="text-h5">
        82.5k
        </h5>
        <span class="text-disabled text-sm">Expenses</span>
        </div> 
      -->

      <VAvatar
        color="rgb(141 136 136)"
        variant="tonal"
        rounded
        size="42"
      >
        <VIcon icon="tabler-users-group" />
      </VAvatar>
      <!--
        <VChip
        color="disabled"
        label
        style="float: right; height: 40px;"
        >
        82/144
        </VChip> 
      -->
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        type="radialBar"
        :height="150"
      />

      <p
        class="text-sm text-center clamp-text text-disabled mt-3"
        style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;"
      >
        Tenants Paid This Month
      </p>

      <!--
        <p class="mb-3">
        1100 88
        </p> 
      -->
      <VChip
        color="disabled"
        label
      >
        <span style="font-size: 20px;">82</span><span style="font-size: 14px;">/144</span>
      </VChip>
    </VCardText>
  </VCard>
</template>
