<template>
  <v-app>
    <v-main>
      <home-page></home-page>
    </v-main>
  </v-app>
</template>

<script>
import HomePage from "@/components/HomePage";

export default {
  name: "App",
  components: {
    HomePage,
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
@import "~vuetify/src/styles/settings/variables";

@media #{map-get($display-breakpoints, 'xl-only')} {
  .container {
    max-width: 1185px !important;
  }
}
</style>
