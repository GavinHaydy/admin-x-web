<script lang="ts" setup>
import * as echarts from 'echarts';

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
});

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const initChart = () => {
  if (!chartContainer.value) return;
  if (chartInstance) {
    chartInstance.dispose();
  }
  chartInstance = echarts.init(chartContainer.value);
  chartInstance.setOption(props.option);
};

// 窗口大小变化时重新调整图表
const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  initChart();
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('resize', handleResize);
  // 销毁图表实例
  chartInstance?.dispose();
});
</script>

<template>
  <div
    ref="chartContainer"
    class="rd-[var(--border-radius-outer)] border-1px border-solid border-color-[var(--color-border-secondary)] w-100% h-310px overflow-hidden"
  />
</template>
