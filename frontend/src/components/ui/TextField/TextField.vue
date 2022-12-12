<template>
  <div class="textFieldWrapper">
    <label>
      {{ label }}
      <input
        :type="inputType"
        :placeholder="placeholder"
        @input="handleInputChange"
      />
      <div
        class="iconWrapper showPasswordWrapper"
        v-if="isPasswordField"
        @click="togglePasswordVisibility"
      >
        <img
          :src="`/img/icons/${showPassword ? 'eye' : 'eye-blind'}.svg`"
          alt="Show Password Icon"
        />
      </div>
      <div class="iconWrapper" v-if="icon && !isPasswordField">
        <img :src="`/img/icons/${icon}.svg`" alt="Send Icon" />
      </div>
    </label>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'TextField',
  props: {
    label: String,
    placeholder: String,
    icon: String,
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: String | Object,
    },
    isPasswordField: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPassword: false,
      inputType: 'text',
      eyeIcon: 'eye-blind',
    };
  },
  mounted() {
    this.inputType = this.type;
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
      this.inputType = this.showPassword ? 'text' : 'password';
    },

    handleInputChange(e) {
      this.$emit('inputChange', e.target.value);
    },
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
