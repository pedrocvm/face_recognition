<template>
  <div class="containerWrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Container',
});
</script>

<style lang="scss">
@import './styles';
</style>
