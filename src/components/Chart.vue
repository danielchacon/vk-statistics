<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  mounted() {
    this.renderChart({
      labels: Array.from({ length: 25 }, (v, k) => k),
      datasets: [
        {
          label: "Просмотры",
          backgroundColor: "#f87979",
          data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
        },
      ],
    });
  },
};
</script>
