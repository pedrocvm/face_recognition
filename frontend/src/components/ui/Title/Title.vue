<template>
  <div class="titleWrapper" :class="[size, color]">
    <h3>{{ text }}</h3>
    <p v-if="!!subtitle">{{ subtitle }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type TitleSizeType = 'small' | 'medium' | 'large';
type TitleColor = 'light' | 'dark';

export default Vue.extend({
  name: 'Title',
  props: {
    text: {
      type: String,
      required: true,
    },
    subtitle: String,
    size: {
      type: String as () => TitleSizeType,
      default: 'medium',
    },
    color: {
      type: String as () => TitleColor,
      default: 'dark',
    },
  },
  setup(props) {
    props.size;
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
