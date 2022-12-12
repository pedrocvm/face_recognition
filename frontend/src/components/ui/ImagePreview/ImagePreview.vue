<template>
  <div
    class="imagePreviewWrapper"
    :class="isVisible ? 'visible' : ''"
    v-if="selectedUpload.name"
  >
    <div class="overlayWrapper" />
    <div class="contentWrapper" v-if="selectedUpload.data">
      <Title
        :text="`${selectedUpload.data.length} ${
          selectedUpload.data.length === 1 ? 'face' : 'faces'
        } encountered`"
        color="light"
      />
      <div class="imagePreview">
        <img
          :src="selectedUpload.imageUrl"
          ref="image-preview"
          id="image-preview"
        />
      </div>
      <div class="actionWrapper">
        <Button label="Close" :fullwidth="true" @action="handleClose" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Button from '@/components/ui/Button/Button.vue';
import Title from '@/components/ui/Title/Title.vue';

export default Vue.extend({
  name: 'ImagePreview',
  components: {
    Button,
    Title,
  },

  computed: {
    selectedUpload() {
      return this.$store.getters.getSelectedUpload;
    },

    isVisible() {
      return this.$store.getters.getIsPreviewOpen;
    },
  },

  methods: {
    handleClose() {
      this.$store.commit('setIsPreviewOpen', false);
    },
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
