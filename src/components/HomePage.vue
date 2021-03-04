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
        <div class="text-h5 mb-4">
          Для вывода статистики необходимо<sup style="opacity: 0.7">1</sup>:
        </div>
        <ol class="mb-4">
          <li>
            создать
            <a href="https://vk.com/apps?act=manage" target="_blank"
              >приложение VK</a
            >
            (Standalone-приложение или Сайт) под свое сообщество или
            отредактировать существующее
          </li>
          <li>
            в Настройках приложения включить Open API и добавить адрес нашего
            сайта в список Базовых доменов (и в Адрес сайта, если поле не
            заполнено)
          </li>
          <li>
            скопировать <span class="font-weight-bold">ID приложения</span> в
            форму ниже
          </li>
          <li>
            перейти в Настройки сообщества и скопировать
            <span class="font-weight-bold">ID сообщества</span> из Основной
            информации (без «public») в форму ниже
          </li>
          <li>нажать <span class="font-weight-bold">Загрузить</span></li>
        </ol>
        <div style="max-width: 600px" class="mx-auto my-8">
          <v-card>
            <v-card-text>
              <v-text-field
                label="ID приложения"
                outlined
                v-model="apiId"
                ref="apiId"
                :rules="[() => !!apiId || 'Поле обязательно для заполнения']"
              ></v-text-field>
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
                  :disabled="loading"
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
        <p style="font-size: 12px; opacity: 0.7;">
          <sup>1</sup> Система VK Open API позволяет передавать данные только
          доверенным сайтам. Таким образом вы временно включаете адрес сайта VK
          Prime Time в список доверенных. После просмотра статистики вы можете
          удалить адрес нашего сайта из списка Базовых доменов, или вообще
          удалить приложение в его Настройках.
        </p>
        <p class="mb-0" style="font-size: 12px; opacity: 0.7;">
          <sup>2</sup> Система VK Open API позволяет загружать данные только по
          100 записям за раз.
        </p>
      </v-container>
    </section>
    <section class="py-12 white" v-if="this.items.length">
      <v-container>
        <ul class="mb-4">
          <li>
            <span class="font-weight-bold">Кол-во загруженных записей</span>:
            {{ this.count }}
          </li>
          <li>
            <span class="font-weight-bold">Просмотров всего</span>:
            {{ this.viewsTotal }}
          </li>
          <li>
            <span class="font-weight-bold">Лайков всего</span>:
            {{ this.likesTotal }}
          </li>
          <li>
            <span class="font-weight-bold">Репостов всего</span>:
            {{ this.repostsTotal }}
          </li>
          <li>
            <span class="font-weight-bold">Комментов всего</span>:
            {{ this.commentsTotal }}
          </li>
          <li>
            <span class="font-weight-bold">Диапазон дат</span>:
            {{ this.dateRange }}
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
    whatFor: false,
    apiId: null,
    communityId: null,
    currentApiId: null,
    currentCommunityId: null,
    errors: [],
    count: 0,
    offset: 0,
    loading: false,
    items: [],
    views: Array.from({ length: 25 }, () => []),
    likes: Array.from({ length: 25 }, () => []),
    reposts: Array.from({ length: 25 }, () => []),
    comments: Array.from({ length: 25 }, () => []),
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
    loadButtonText() {
      return this.loading
        ? "Загружается"
        : this.count > 0 &&
          this.apiId === this.currentApiId &&
          this.communityId === this.currentCommunityId
        ? "Загрузить еще 100<sup style='opacity: 0.7'>2</sup>"
        : "Загрузить <sup style='opacity: 0.7'>2</sup>";
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
      return this.items.length
        ? `${new Date(
            this.items[this.items.length - 1].date * 1000
          ).getDate()}.${new Date(
            this.items[this.items.length - 1].date * 1000
          ).getMonth() + 1}.${new Date(
            this.items[this.items.length - 1].date * 1000
          ).getFullYear()} — ${new Date(
            this.items[0].date * 1000
          ).getDate()}.${new Date(this.items[0].date * 1000).getMonth() +
            1}.${new Date(this.items[0].date * 1000).getFullYear()}`
        : "";
    },
  },
  methods: {
    showWhatFor() {
      this.whatFor = !this.whatFor;
    },
    validateForm() {
      this.$refs.apiId.validate(true);
      this.$refs.communityId.validate(true);
    },
    getData() {
      const that = this;

      this.validateForm();

      if (this.apiId && this.communityId) {
        // eslint-disable-next-line no-undef
        VK.init({
          apiId: that.apiId,
        });

        this.currentApiId = this.apiId;
        this.currentCommunityId = this.communityId;
        this.loading = true;

        // eslint-disable-next-line no-undef
        VK.Api.call(
          "wall.get",
          {
            owner_id: `-${that.communityId}`,
            count: 100,
            offset: that.offset,
            v: "5.130",
          },
          function(r) {
            if ("error" in r === false) {
              that.items = that.items.concat(r.response.items);
              that.count += r.response.items.length;
              that.offset = that.count;

              Array.from({ length: 25 }, (v, k) => k).forEach((item0) => {
                r.response.items.forEach((item) => {
                  if (new Date(item.date * 1000).getHours() === item0) {
                    that.views[item0].push(item.views.count);
                    that.likes[item0].push(item.likes.count);
                    that.reposts[item0].push(item.reposts.count);
                    that.comments[item0].push(item.comments.count);
                  }
                  if (new Date(item.date * 1000).getHours() === 0) {
                    that.views[24].push(item.views.count);
                    that.likes[24].push(item.likes.count);
                    that.reposts[24].push(item.reposts.count);
                    that.comments[24].push(item.comments.count);
                  }
                });
              });
            }
            that.loading = false;
          }
        );
      }
    },
  },
};
</script>
