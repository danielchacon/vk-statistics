<template>
  <div>
    <header class="py-14 white">
      <v-container class="py-0">
        <h1 class="text-h2 text-center mb-3">VK Prime Time</h1>
        <div class="text-center text--secondary">
          Статистика популярности публикаций в сообществах VK относительно
          времени их размещения
        </div>
      </v-container>
    </header>
    <section class="py-12 blue lighten-5">
      <v-container class="py-0">
        <p>
          Для вывода статистики необходимо:
        </p>
        <ol class="mb-4">
          <li>
            создать
            <a href="https://vk.com/apps?act=manage" target="_blank"
              >приложение VK</a
            >
            под свое сообщество (Standalone-приложение или Сайт) или
            отредактировать существующее
          </li>
          <li>
            в Настройках приложения включить Open API и добавить адрес нашего
            сайта в список Базовых доменов (и в Адрес сайта, если поле не
            заполнено)
          </li>
          <li>скопировать ID приложения и ID сообщества в форму ниже</li>
          <li>нажать <span class="font-weight-bold">Загрузить</span></li>
        </ol>
        <p>
          Дисклеймер: эта страница не собирает инфорацию — ни введенную, ни
          полученную. Сервис предназначен исключительно для визуализации данных
          доступных руководителю сообщества.
        </p>
        <p>
          <button
            type="button"
            class="green--text text--darken-2"
            @click="showWhatFor"
          >
            Зачем нужны эти действия?
          </button>
        </p>
        <div v-show="whatFor">
          <p>
            Система VK Open API, позволяет передавать данные только доверенным
            сайтам. Таким образом вы временно включаете адрес сайта VK Prime
            Time в список доверенных. После просмотра статистики вы можете
            удалить адрес нашего сайта из списка Базовых доменов, или вообще
            удалить приложение в его Настройках.
          </p>
        </div>
        <v-row class="mt-0">
          <v-col cols="4" offset="4">
            <v-card>
              <v-card-text>
                <v-text-field label="ID приложения" outlined></v-text-field>
                <v-text-field label="ID сообщества" outlined></v-text-field>
                <div class="d-flex justify-center">
                  <v-btn color="primary" elevation="2" large @click="getData"
                    >Загрузить</v-btn
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section class="py-12 white">
      <v-container>
        <chart></chart>
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
    count: 100,
    apiId: 7769410,
    communityId: 24936435,
  }),
  methods: {
    showWhatFor() {
      this.whatFor = !this.whatFor;
    },
    getData() {
      // eslint-disable-next-line no-undef
      VK.init({
        apiId: this.apiId,
      });
      // eslint-disable-next-line no-undef
      VK.Api.call(
        "wall.get",
        { owner_id: `-${this.communityId}`, count: this.count, v: "5.130" },
        function(r) {
          console.log(r.response.items);
        }
      );
    },
  },
};
</script>
