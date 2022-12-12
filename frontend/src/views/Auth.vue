<template>
  <main class="authWrapper">
    <section class="bannerWrapper" />
    <section class="formWrapper">
      <Title :text="!isNewAccount ? 'Sign in' : 'Sign up'" size="large" />

      <div class="formContentWrapper">
        <AuthForm
          :name="name"
          :email="email"
          :password="password"
          :isNewAccount="isNewAccount"
          @submit="submitCredentials"
          @update="updateFormData"
        />

        <div class="signUpWrapper">
          <span>{{
            !isNewAccount ? 'Not a member?' : 'Already a member?'
          }}</span>
          <Button
            :label="!isNewAccount ? 'Sign up' : 'Sign in'"
            size="small"
            type="primary"
            :minimal="true"
            @action="toggleFirstAccess"
          />
        </div>
      </div>

      <span class="errorMessage" v-if="!!errorMessage">
        {{ errorMessage }}
      </span>
    </section>
  </main>
</template>

<script>
import Vue from 'vue';
import AuthForm from '@/components/ui/AuthForm/AuthForm.vue';
import Title from '@/components/ui/Title/Title.vue';
import Button from '@/components/ui/Button/Button.vue';
import AuthService from '@/services/Auth';

export default Vue.extend({
  name: 'Auth',
  components: {
    AuthForm,
    Button,
    Title,
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      formData: {},
      isNewAccount: false,
      currentUser: {},
      errorMessage: '',
    };
  },

  methods: {
    toggleFirstAccess() {
      this.isNewAccount = !this.isNewAccount;
      this.errorMessage = '';
    },

    submitCredentials() {
      this.formData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };

      if (!this.isNewAccount) {
        delete this.formData.name && delete this.formData.role;

        AuthService.signin(this.formData).then((res) => {
          if (!!res.error) {
            this.errorMessage = res.error;
          } else {
            this.currentUser = res;
            this.errorMessage = '';
            this.saveUserAccessData(this.currentUser);
            this.email = '';
            this.password = '';
            this.$router.replace({ name: 'Home' });
          }
        });
      } else {
        this.formData.role = '1';
        AuthService.signup(this.formData).then((res) => {
          if (!!res.error) {
            this.errorMessage = res.error;
          } else {
            const userList = this.$store.getters.getUserList;
            userList.push(res);
            this.$store.commit('setUserList', userList);
            this.currentUser = res;
            this.errorMessage = '';
            this.saveUserAccessData(this.currentUser);
            this.isNewAccount = false;
            this.name = '';
            this.email = '';
            this.password = '';
            this.$router.replace({ name: 'Home' });
          }
        });
      }
    },

    updateFormData(field, data) {
      this[field] = data;
    },

    saveUserAccessData(data) {
      if (!!data) {
        this.$store.dispatch('saveAccessData', data);
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/sass/master';

.authWrapper {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 48rem;

  .formWrapper {
    height: 100%;
    background: map-get($colors, white);
    @include flexbox(column, center, center, map-get($spacings, xsmall));
    padding: map-get($spacings, xxlarge);

    .formContentWrapper {
      width: 100%;
      @include flexbox(column, center, center, map-get($spacings, xxsmall));

      .signUpWrapper {
        width: 100%;
        @include flexbox(row, center, center, map-get($spacings, xxsmall));
      }
    }
  }

  .bannerWrapper {
    height: 100%;
    background-image: url('/img/banner.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .errorMessage {
    color: map-get($colors, red);
    border: 0.1rem solid map-get($colors, red);
    padding: map-get($spacings, xxsmall);
    width: 100%;
    text-align: center;
  }
}
</style>
