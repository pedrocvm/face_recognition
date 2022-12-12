<template>
  <div class="uploadFieldWrapper">
    <label :class="file.name ? 'disabled' : ''">
      {{ !file.name ? 'Upload your file' : file.name }}
      <input
        ref="inputFile"
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        @input="handleInputChange"
        :disabled="file.name"
      />
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'UploadField',
  props: ['file'],
  methods: {
    handleInputChange(e: any) {
      const file = e.target.files[0];
      const blob = file.slice(0, file.size, 'image/png');
      const newFile = new File([blob], this.sanitizeFileName(file.name), {
        type: 'image/png',
      });

      this.$emit('upload', newFile);
    },

    reset() {
      const dt = new DataTransfer();
      (this.$refs['inputFile'] as HTMLInputElement).files = dt.files;
    },

    sanitizeFileName(str: string) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
