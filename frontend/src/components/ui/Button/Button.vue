<template>
  <div class="buttonWrapper" :class="fullwidth ? 'fullwidth' : ''">
    <button
      :class="[
        type,
        size,
        color,
        minimal ? 'minimal' : '',
      ]"
      :disabled='disabled'
      @click="handleButtonAction"
    >
      {{ label }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export type ButtonType = 'primary' | 'success' | 'error' | 'warning';
export type ButtonSize = 'tiny' | 'small' | 'medium' | 'large';
export type ButtonColor = 'light' | 'dark';

export default Vue.extend({
  name: 'Button',
  props: {
    label: String,
    type: String as () => ButtonType,
    size: {
      type: String as () => ButtonSize,
      default: 'medium',
    },
    color: {
      type: String as () => ButtonColor,
      default: 'dark',
    },
    fullwidth: Boolean,
    minimal: Boolean,
    disabled: Boolean,
  },

  setup(props) {
    props.type;
    props.size;
  },

  methods: {
    handleButtonAction() {
      this.$emit('action');
    },
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
