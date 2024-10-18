import { chartsConfig } from "@/configs";

// Pie Chart Configuration for "Réalisées" and "À faire"
const tasksPieChart = {
  type: "pie",
  height: 350,  // Slightly larger for better visibility
  series: [2300, 3462], // Example data: 2300 "Réalisées", 3462 "À faire"
  options: {
    ...chartsConfig,
    labels: ["Réalisées", "À faire"],
    colors: ["#4caf50", "#ffeb3b"], // Green for "Réalisées", Yellow for "À faire"
    legend: {
      position: "bottom",
      labels: {
        colors: '#333',
        useSeriesColors: false,
        style: {
          fontSize: '16px',
          fontWeight: '500',
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => `${opts.w.config.series[opts.seriesIndex]}: ${val.toFixed(1)}%`,
      style: {
        colors: ['#333'],
        fontSize: '14px',
        fontWeight: 'bold',
      },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.2
      }
    },
    chart: {
      background: 'white', // Background for the chart
      foreColor: '#333', // Adjusting the font color for better contrast
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.1
      }
    },
    fill: {
      opacity: 1,
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 600,
              color: '#333'
            }
          }
        },
      },
    },
    stroke: {
      show: true,
      colors: ['#fff'],
      width: 2
    },
    theme: {
      mode: 'light', // Ensure the light theme to avoid any background colors
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 250
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  },
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Tâches Réalisées vs À Faire",
    description: "Distribution des tâches",
    chart: tasksPieChart,
  },
];

export default statisticsChartsData;
