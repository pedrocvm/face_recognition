<template>
  <Container>
    <div class="footerWrapper">
      Created by
      <a
        href="https://github.com/pedrocvm"
        rel="noopener noreferrer"
        target="_blank"
        >@pedrocvm</a
      >
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from 'vue';
import Container from '@/components/structure/Container/Container.vue';

export default Vue.extend({
  name: 'Footer',
  components: {
    Container,
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
