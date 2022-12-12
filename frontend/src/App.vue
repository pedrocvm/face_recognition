<template>
  <div id="app">
    <div class="fixedHeaderWrapper">
      <Header v-if="$route.name !== 'Auth'" />
    </div>

    <div class="appWrapper">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <Footer v-if="$route.name !== 'Auth'" />
  </div>
</template>

<script>
import Vue from 'vue';
import Home from '@/views/Home.vue';
import Header from '@/components/structure/Header/Header.vue';
import Footer from '@/components/structure/Footer/Footer.vue';

export default Vue.extend({
  components: {
    Home,
    Header,
    Footer,
  },
});
</script>

<style lang="scss">
@import '@/sass/global';

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

#app {
  height: 100%;
}

.fixedHeaderWrapper {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: map-get($layers, alwaysOnTop);
}

.appWrapper {
  padding: 7.5rem 0;
  min-height: calc(100% - 5rem);
  transition: map-get($transition, default);

  @media (max-width: 1024px) {
    padding: 15rem 0 0rem;
  }

  @media (max-width: 768px) {
    padding: 20rem 0 0rem;
  }
}
</style>
