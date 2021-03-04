<template>
  <div>
    <header class="py-14 white">
      <v-container class="py-0">
        <h1 class="text-h2 text-center mb-3">
          <span class="blue--text">VK</span> Prime Time
        </h1>
        <div class="text-center text--secondary">
          Статистика популярности публикаций в сообществах VK по времени их
          размещения
        </div>
      </v-container>
    </header>
    <section class="py-12 blue lighten-5">
      <v-container class="py-0">
        <p>Статистику можно вывести только открытых сообществ.</p>
        <div class="text-h5 mb-4">
          Как это сделать?
        </div>
        <ol class="mb-4">
          <li>
            ввести
            <span class="font-weight-bold">ID сообщества</span>
          </li>
          <li><span class="font-weight-bold">Загрузить</span></li>
        </ol>
        <div style="max-width: 600px" class="mx-auto my-8">
          <v-card>
            <v-card-text>
              <v-text-field
                label="ID сообщества"
                outlined
                v-model="communityId"
                ref="communityId"
                :rules="[
                  () => !!communityId || 'Поле обязательно для заполнения',
                ]"
              ></v-text-field>
              <div class="d-flex justify-center">
                <v-btn
                  color="primary"
                  elevation="2"
                  large
                  @click="getData"
                  :disabled="buttonEnable === false"
                  v-html="loadButtonText"
                ></v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <p>
          <span class="font-weight-bold">Дисклеймер</span>: сайт не собирает
          пользовательскую информацию. Сервис предназначен исключительно для
          визуализации общедоступных данных.
        </p>
        <p class="mb-0" style="font-size: 12px; opacity: 0.7;">
          <sup>1</sup> Система VK Open API позволяет загружать данные только 100
          записей за раз.
        </p>
      </v-container>
    </section>
    <section class="py-12 white" v-if="currentItems && currentItems.length">
      <v-container>
        <ul class="mb-4">
          <li>
            <span class="font-weight-bold">Кол-во загруженных записей</span>:
            {{ currentItems.length }}
          </li>
          <li>
            <span class="font-weight-bold">Просмотров всего</span>:
            {{ viewsTotal }}
          </li>
          <li>
            <span class="font-weight-bold">Лайков всего</span>:
            {{ likesTotal }}
          </li>
          <li>
            <span class="font-weight-bold">Репостов всего</span>:
            {{ repostsTotal }}
          </li>
          <li>
            <span class="font-weight-bold">Комментов всего</span>:
            {{ commentsTotal }}
          </li>
          <li>
            <span class="font-weight-bold">Диапазон дат</span>:
            {{ dateRange }}
          </li>
        </ul>
        <chart
          :chartData="chartData"
          :options="chartOptions"
          class="mb-4"
        ></chart>
        <div class="font-weight-bold mb-2">
          Формула расчета усредненного количества:
        </div>
        <span class="font-italic font-weight-bold px-2 py-2 blue lighten-5"
          >P = (a1 + a2 + … an) / n</span
        >
      </v-container>
    </section>
    <section
      class="py-12 white"
      v-if="currentItems && currentItems.length === 0"
    >
      <v-container>
        <div class="font-weight-bold mb-2">
          Кажется, в сообществе нет записей :(
        </div>
      </v-container>
    </section>
  </div>
</template>

<script>
import Chart from "@/components/Chart";

export default {
  name: "App",
  components: {
    Chart,
  },
  data: () => ({
    apiId: "7769410",
    communityId: "24936435",
    // currentCommunityId: null,
    // communityConfirmed: false,
    // count: 0,
    // offset: 0,
    // isThereMore: true,
    process: false,
    processStatus: null,
    // checkingForMore: false,
    collection: [],
    // items: [],
    chartOptions: {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: "Усредненное количество",
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Часы",
            },
          },
        ],
      },
    },
  }),
  computed: {
    chartData() {
      return {
        labels: Array.from({ length: 25 }, (v, k) => k),
        datasets: [
          {
            label: "Просмотры",
            backgroundColor: "rgba(255, 235, 59, 0.2)",
            borderColor: "rgb(255, 235, 59)",
            borderWidth: 3,
            pointRadius: 3,
            pointBorderWidth: 3,
            data: this.views.map(
              (a) => Math.round(a.reduce((p, c) => p + c, 0) / a.length) || 0
            ),
          },
          {
            label: "Лайки",
            backgroundColor: "rgba(244, 67, 54, 0.2)",
            borderColor: "rgb(244, 67, 54)",
            borderWidth: 3,
            pointRadius: 3,
            pointBorderWidth: 3,
            data: this.likes.map(
              (a) => Math.round(a.reduce((p, c) => p + c, 0) / a.length) || 0
            ),
          },
          {
            label: "Репосты",
            backgroundColor: "rgba(255, 152, 0, 0.2)",
            borderColor: "rgb(255, 152, 0)",
            borderWidth: 3,
            pointRadius: 3,
            pointBorderWidth: 3,
            data: this.reposts.map(
              (a) => Math.round(a.reduce((p, c) => p + c, 0) / a.length) || 0
            ),
          },
          {
            label: "Комменты",
            backgroundColor: "rgba(0, 150, 136, 0.2)",
            borderColor: "rgb(0, 150, 136)",
            borderWidth: 3,
            pointRadius: 3,
            pointBorderWidth: 3,
            data: this.comments.map(
              (a) => Math.round(a.reduce((p, c) => p + c, 0) / a.length) || 0
            ),
          },
        ],
      };
    },
    buttonEnable() {
      return !this.process && !this.allLoaded;
    },
    loadButtonText() {
      if (this.allLoaded === false) {
        return "Загрузить еще<sup style='opacity: 0.7'>1</sup>";
      }

      if (this.allLoaded) {
        return "Записей больше нет";
      }

      if (this.processStatus === "load") {
        return "Загрузка";
      }

      if (this.processStatus === "preload") {
        return "Предзагрузка следующих записей";
      }

      return "Загрузить <sup style='opacity: 0.7'>1</sup>";
    },
    currentObject() {
      return (
        this.collection.find((item) => item.id === this.communityId) ?? null
      );
    },
    currentItems() {
      return (
        this.collection.find((item) => item.id === this.communityId)?.items ??
        null
      );
    },
    allLoaded() {
      return (
        this.currentItems &&
        this.currentItems.length &&
        this.currentObject &&
        this.currentObject.allLoaded
      );
    },
    views() {
      const temp = Array.from({ length: 25 }, () => []);

      if (this.currentItems) {
        temp.forEach((item0, index) => {
          this.currentItems.forEach((item) => {
            if (new Date(item.date * 1000).getHours() === index) {
              item0.push(item.views?.count ?? 0);
            }
          });
        });
      }

      return temp;
    },
    likes() {
      const temp = Array.from({ length: 25 }, () => []);

      if (this.currentItems) {
        temp.forEach((item0, index) => {
          this.currentItems.forEach((item) => {
            if (new Date(item.date * 1000).getHours() === index) {
              item0.push(item.likes?.count ?? 0);
            }
          });
        });
      }

      return temp;
    },
    reposts() {
      const temp = Array.from({ length: 25 }, () => []);

      if (this.currentItems) {
        temp.forEach((item0, index) => {
          this.currentItems.forEach((item) => {
            if (new Date(item.date * 1000).getHours() === index) {
              item0.push(item.reposts?.count ?? 0);
            }
          });
        });
      }

      return temp;
    },
    comments() {
      const temp = Array.from({ length: 25 }, () => []);

      if (this.currentItems) {
        temp.forEach((item0, index) => {
          this.currentItems.forEach((item) => {
            if (new Date(item.date * 1000).getHours() === index) {
              item0.push(item.comments?.count ?? 0);
            }
          });
        });
      }

      return temp;
    },
    viewsTotal() {
      return this.views
        .map((a) => a.reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
    },
    likesTotal() {
      return this.likes
        .map((a) => a.reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
    },
    repostsTotal() {
      return this.reposts
        .map((a) => a.reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
    },
    commentsTotal() {
      return this.comments
        .map((a) => a.reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
    },
    dateRange() {
      return this.currentItems && this.currentItems.length
        ? `${new Date(
            this.currentItems[this.currentItems.length - 1].date * 1000
          ).getDate()}.${new Date(
            this.currentItems[this.currentItems.length - 1].date * 1000
          ).getMonth() + 1}.${new Date(
            this.currentItems[this.currentItems.length - 1].date * 1000
          ).getFullYear()} — ${new Date(
            this.currentItems[0].date * 1000
          ).getDate()}.${new Date(this.currentItems[0].date * 1000).getMonth() +
            1}.${new Date(this.currentItems[0].date * 1000).getFullYear()}`
        : null;
    },
  },
  methods: {
    validateForm() {
      this.$refs.communityId.validate(true);
    },
    getData() {
      const that = this;

      this.validateForm();

      if (this.communityId) {
        // eslint-disable-next-line no-undef
        VK.init({
          apiId: that.apiId,
        });

        if (
          this.collection.filter((item) => item.id === this.communityId)
            .length === 0
        ) {
          this.collection.push({
            id: this.communityId,
            items: [],
            allLoaded: false,
          });
        }

        this.process = true;

        // eslint-disable-next-line no-undef
        VK.Api.call(
          "wall.get",
          {
            owner_id: `-${that.communityId}`,
            count: 100,
            offset: that.currentItems.length,
            v: "5.130",
          },
          function(r) {
            if ("error" in r === false) {
              if (r.response.items.length) {
                that.collection.find(
                  (item) => item.id === that.communityId
                ).items = that.collection
                  .find((item) => item.id === that.communityId)
                  .items.concat(r.response.items);
              } else {
                that.collection.find(
                  (item) => item.id === that.communityId
                ).allLoaded = true;
              }
            }

            that.process = false;
          }
        );
      }
    },
  },
};
</script>
