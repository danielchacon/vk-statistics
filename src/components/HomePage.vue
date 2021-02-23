<template>
  <div>
    <header class="py-14">
      <v-container>
        <h1 class="text-h2 text-center mb-3">VK Prime Time</h1>
        <v-row>
          <v-col cols="6" offset="3" class="py-0">
            <div class="text-center text--secondary">
              Cтатистика суточной активности пользователей
              <br />
              в сообществах Вконтакте
            </div>
          </v-col>
        </v-row>
      </v-container>
    </header>
    <section class="py-12 blue lighten-5">
      <v-container>
        <v-row>
          <v-col cols="6" offset="3">
            <div class="text-center mb-2">
              Для вывода статистики необходимо:
            </div>
            <ol class="mb-2">
              <li>создать приложение VK</li>
              <li>вставить его ID в поле ниже</li>
              <li>нажать Загрузить</li>
            </ol>
            <div class="text-center">
              <span>Как создать приложение?</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" offset="4">
            <v-card>
              <v-card-text>
                <v-text-field label="ID" outlined></v-text-field>
                <div class="d-flex justify-center">
                  <v-btn color="primary" elevation="2" large>Загрузить</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>