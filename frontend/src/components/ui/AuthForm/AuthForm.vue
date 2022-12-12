<template>
  <main class="authFormWrapper">
    <form class="formFieldsWrapper" ref="auth-form">
      <TextField
        label="Name"
        :value="name"
        v-if="isNewAccount"
        @inputChange="$emit('update', 'name', $event)"
      />
      <TextField
        ref="userEmail"
        label="Email"
        type="email"
        :value="email"
        @inputChange="$emit('update', 'email', $event)"
      />
      <TextField
        label="Password"
        type="password"
        :isPasswordField="true"
        :value="password"
        :minlength="8"
        @inputChange="$emit('update', 'password', $event)"
      />
    </form>

    <div class="actionWrapper">
      <Button
        :label="!isNewAccount ? 'Sign in' : 'Sign up'"
        :fullwidth="true"
        type="primary"
        color="light"
        @action="submit"
        :disabled="isDisabled"
      />
    </div>
  </main>
</template>

<script>
import Vue from 'vue';
import TextField from '@/components/ui/TextField/TextField.vue';
import Button from '@/components/ui/Button/Button.vue';
import Title from '@/components/ui/Title/Title.vue';
import { checkValidEmail } from '@/utils/formValidations';

export default Vue.extend({
  name: 'AuthForm',
  components: {
    TextField,
    Button,
    Title,
  },
  props: {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isNewAccount: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isDisabled() {
      return (
        [this.email, this.password, this.isNewAccount && this.name].includes(
          ''
        ) || !checkValidEmail(this.email)
      );
    },
  },
  methods: {
    submit() {
      this.$emit('submit');
    },
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
