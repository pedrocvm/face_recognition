<template>
  <Container>
    <div class="headerWrapper" v-scroll="handleScroll">
      <div class="headerTitleWrapper">
        <Title
          text="Face Recognition"
          :color="isTranslucid ? 'dark' : 'light'"
        />
      </div>

      <div class="welcomeWrapper">
        <div>
          <span>Welcome, </span>
          <strong>{{ currentUser.name }}</strong>
        </div>
        <Button
          label="Logout"
          :minimal="true"
          :color="isTranslucid ? 'dark' : 'light'"
          type="primary"
          size="small"
          @action="logout"
        />
      </div>
    </div>
  </Container>
</template>

<script>
import Vue from 'vue';
import Container from '@/components/structure/Container/Container.vue';
import Title from '@/components/ui/Title/Title.vue';
import Button from '@/components/ui/Button/Button.vue';
import AuthService from '@/services/Auth';

export default Vue.extend({
  name: 'Header',
  components: {
    Container,
    Title,
    Button,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      isTranslucid: false,
    };
  },

  computed: {
    currentUser() {
      return this.$store.getters.getCurrentUser;
    },
  },

  mounted() {
    window.addEventListener('resize', this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  methods: {
    handleScroll(event, el) {
      if (window.scrollY >= 150) {
        el.classList.add('translucid');
        this.isTranslucid = true;
      } else {
        el.classList.remove('translucid');
        this.isTranslucid = false;
      }
    },

    onResize() {
      this.windowWidth = window.innerWidth;
    },

    logout() {
      AuthService.logout().finally(() => {
        this.$router.replace({ name: 'Auth' });
      });
    },
  },
  directives: {
    scroll: {
      inserted: function (el, binding) {
        const f = function (event) {
          if (binding.value(event, el)) {
            window.removeEventListener('scroll', f);
          }
        };

        window.addEventListener('scroll', f);
      },
    },
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
