<template>
  <div>
    <header class="py-7 py-md-14 white">
      <v-container class="py-0">
        <div class="d-flex justify-center mb-2">
          <icon-base icon-name="fire" class="logo deep-orange--text"
            ><icon-fire
          /></icon-base>
        </div>
        <h1 style="font-size: 1rem; font-weight: normal;">
          <div class="text-h4 text-md-h2 text-center mb-3 heading">
            <span class="blue--text heading-vk">VK</span> Prime Time
          </div>
          <div class="text-center text--secondary">
            Анализ популярности постов в сообществах ВК по времени их размещения
          </div>
        </h1>
      </v-container>
    </header>
    <section class="py-6 py-md-12 blue lighten-5">
      <v-container class="py-0">
        <p>
          <strong>В какое время выкладывать посты</strong> — этим вопросом
          задаются многие руководители сообществ ВКонтакте. С помощью этого
          сервиса вы можете обратиться к системе VK Open API и получить
          <strong>статистику</strong> по количеству просмотров, лайков, репостов
          и комментариев к записям на странице сообщества относительно времени
          их размещения. И как следствие: выбрать
          <strong>лучшее время для публикаций</strong> ваших постов.
        </p>
        <p>
          Статистику можно вывести только
          <span class="text-decoration-underline">открытых</span> сообществ.
        </p>
        <h2 class="text-h5 mb-4">Как узнать лучшее время для публикаций?</h2>
        <ol class="mb-4">
          <li>
            ввести
            <span class="font-weight-bold">ID или короткое имя сообщества</span>
          </li>
          <li><span class="font-weight-bold">Загрузить</span></li>
        </ol>
        <div class="mx-auto my-8 id-form">
          <v-card>
            <v-card-text>
              <v-text-field
                label="ID или короткое имя сообщества"
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
          визуализации
          <span class="text-decoration-underline">общедоступных</span> данных.
        </p>
        <p class="mb-0 footnote">
          <sup>1</sup> Система VK Open API позволяет загружать данные только 100
          записей за раз.
        </p>
      </v-container>
    </section>
    <section
      class="py-6 py-md-12 white"
      v-if="
        (currentItems && currentItems.length) ||
          (currentObject &&
            currentObject.error === null &&
            currentItems &&
            currentItems.length === 0 &&
            !process) ||
          (currentObject && currentObject.error)
      "
    >
      <v-container>
        <div v-if="currentItems && currentItems.length">
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
        </div>
        <div
          class="font-weight-bold mb-2"
          v-if="
            currentObject &&
              currentObject.error === null &&
              currentItems &&
              currentItems.length === 0 &&
              !process
          "
        >
          <v-alert type="info"> Кажется, в сообществе нет записей :( </v-alert>
        </div>
        <div
          class="font-weight-bold mb-2"
          v-if="currentObject && currentObject.error"
        >
          <v-alert type="error">
            Ошибка VK Open API: {{ currentObject.error }}
          </v-alert>
        </div>
      </v-container>
    </section>
    <section v-if="blockError">
      <v-container>
        <div class="font-weight-bold mb-2">
          <v-alert type="error">
            Работа сайта заблокирована браузером. Возможная причина: браузер
            видит угрозу в запросах к Google, Yandex и VK. Зачастую проблема
            встречается в Firefox. Вы можете воспользоваться другим браузером
            или отключить блокировку. Для Firefox подробнее
            <a
              href="https://support.mozilla.org/ru/kb/uluchshennaya-zashita-ot-otslezhivaniya-v-firefox-"
              class="white--text"
              target="_blank"
              >тут</a
            >.
          </v-alert>
        </div>
      </v-container>
    </section>

    <footer class="d-flex justify-center py-3 py-md-6">
      <div class="footer-btn-container">
        <a
          class="github-button"
          href="https://github.com/danielchacon/vk-statistics"
          data-icon="octicon-star"
          data-size="large"
          aria-label="Star danielchacon/vk-statistics on GitHub"
          >Star</a
        >
      </div>
    </footer>
  </div>
</template>

<script>
import Chart from "@/components/Chart";
import IconBase from "@/components/icons/IconBase";
import IconFire from "@/components/icons/IconFire";

export default {
  name: "App",
  components: {
    Chart,
    IconBase,
    IconFire,
  },
  data: () => ({
    apiId: "7769410",
    communityId: null,
    process: false,
    collection: [],
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
              labelString: "Количество (среднее арифм.)",
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Время размещения (час)",
            },
          },
        ],
      },
    },
    authReady: false,
    blockError: false,
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
      if (this.process) {
        return "Загрузка";
      } else if (this.allLoaded) {
        return "Записей больше нет";
      } else if (this.allLoaded === false) {
        return "Загрузить еще<sup style='opacity: 0.7'>1</sup>";
      } else {
        return "Загрузить <sup style='opacity: 0.7'>1</sup>";
      }
    },
    currentObject() {
      return (
        this.collection.find(
          (item) =>
            item.id === this.communityId || item.inputId === this.communityId
        ) ?? null
      );
    },
    currentItems() {
      return this.currentObject?.items ?? null;
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
            if (
              new Date(item.date * 1000).getHours() === index &&
              index !== 24
            ) {
              item0.push(item.views?.count ?? 0);
            }
            if (new Date(item.date * 1000).getHours() === 0 && index === 24) {
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
            if (
              new Date(item.date * 1000).getHours() === index &&
              index !== 24
            ) {
              item0.push(item.likes?.count ?? 0);
            }
            if (new Date(item.date * 1000).getHours() === 0 && index === 24) {
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
            if (
              new Date(item.date * 1000).getHours() === index &&
              index !== 24
            ) {
              item0.push(item.reposts?.count ?? 0);
            }
            if (new Date(item.date * 1000).getHours() === 0 && index === 24) {
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
            if (
              new Date(item.date * 1000).getHours() === index &&
              index !== 24
            ) {
              item0.push(item.comments?.count ?? 0);
            }
            if (new Date(item.date * 1000).getHours() === 0 && index === 24) {
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

      const func0 = async () => {
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (that.authReady) {
              resolve();
              clearInterval(interval);
            }
          }, 100);
        });

        if (
          that.collection.filter(
            (item) =>
              item.id === this.communityId || item.inputId === this.communityId
          ).length === 0
        ) {
          // eslint-disable-next-line no-undef
          VK.Api.call(
            "groups.getById",
            {
              group_id: that.communityId,
              group_ids: that.communityId,
              v: "5.130",
            },
            function(r) {
              if ("error" in r === false) {
                that.collection.push({
                  id: JSON.stringify(r.response[0].id),
                  inputId: that.communityId,
                  items: [],
                  allLoaded: false,
                  error: null,
                });
              } else {
                that.collection.push({
                  id: null,
                  inputId: that.communityId,
                  items: [],
                  allLoaded: false,
                  error: r.error.error_msg,
                });
              }
            }
          );
        }

        func();
      };

      const func = async () => {
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (
              that.collection.filter(
                (item) =>
                  item.id === this.communityId ||
                  item.inputId === this.communityId
              ).length
            ) {
              resolve();
              clearInterval(interval);
            }
          }, 100);
        });

        if (that.currentObject.id) {
          // eslint-disable-next-line no-undef
          VK.Api.call(
            "wall.get",
            {
              owner_id: `-${that.currentObject.id}`,
              count: 100,
              offset: that.currentItems?.length || 0,
              v: "5.130",
            },
            function(r) {
              if ("error" in r === false) {
                if (r.response.items.length) {
                  that.collection.find(
                    (item) => item.id === that.currentObject.id
                  ).items = that.collection
                    .find((item) => item.id === that.currentObject.id)
                    .items.concat(r.response.items);
                } else {
                  that.collection.find(
                    (item) => item.id === that.currentObject.id
                  ).allLoaded = true;
                }
              } else {
                that.collection.find(
                  (item) => item.id === that.currentObject.id
                ).error = r.error.error_msg;
              }

              that.process = false;
            }
          );
        } else {
          that.process = false;
        }
      };

      if (this.communityId && !this.process) {
        this.process = true;

        // eslint-disable-next-line no-undef
        VK.init({
          apiId: that.apiId,
        });

        if (!this.authReady) {
          var xhr = new XMLHttpRequest();
          xhr.withCredentials = true;

          xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
              if (JSON.parse(this.responseText).auth === true) {
                that.blockError = false;
                that.authReady = true;
              } else {
                that.blockError = true;
                that.process = false;
              }
            }
          });

          xhr.open(
            "GET",
            `https://login.vk.com/?act=openapi&oauth=1&aid=7769410&location=${
              process.env.NODE_ENV === "development"
                ? "localhost"
                : "vk-prime-time.netlify.app"
            }&new=1`
          );
          xhr.setRequestHeader("Cookie", "remixlang=0");

          xhr.send();
        }

        func0();
      }
    },
  },
};
</script>

<style lang="scss">
@import "~vuetify/src/styles/settings/variables";

.logo {
  width: 100px;
  height: 100px;
}

.id-form {
  max-width: 600px;
}

.footnote {
  font-size: 12px;
  opacity: 0.7;
}

.footer-btn-container > * {
  display: flex;
}
</style>
