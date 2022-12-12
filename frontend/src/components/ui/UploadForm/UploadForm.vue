<template>
  <div class="uploadFormWrapper">
    <UploadField @upload="upload" :file="file" ref="fileField" />
    <div class="fileInputWrapper">
      <div class="imageThumbnailWrapper" v-show="file.name">
        <img alt="upload thumbnail" />
        <Button
          label="Delete"
          :minimal="true"
          size="small"
          color="error"
          :disabled="count !== 0"
          @action="deleteFile"
        />
      </div>

      <div class="actionWrapper" v-if="file.name">
        <Button
          :label="buttonLabel"
          size="large"
          color="primary"
          type="light"
          :disabled="count !== 0"
          @action="submit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import UploadField from '@/components/ui/UploadField/UploadField.vue';
import Button from '@/components/ui/Button/Button.vue';

export default Vue.extend({
  name: 'UploadForm',
  components: {
    UploadField,
    Button,
  },
  data() {
    return {
      file: {},
      buttonLabel: 'Upload',
      count: 0,
    };
  },
  methods: {
    upload(file) {
      this.file = file;
      this.readFile();
    },

    submit() {
      this.count = 5;
      this.$emit('upload', this.file);

      const interval = setInterval(() => {
        this.count -= 1;
        this.buttonLabel = `Wait ${this.count} seconds for a new upload`;

        if (this.count === 0) {
          clearInterval(interval);
          this.deleteFile();
          this.buttonLabel = 'Upload your file';
        }
      }, 1000);
    },

    readFile() {
      const reader = new FileReader();
      const img = document.querySelector('.imageThumbnailWrapper img');

      reader.onloadend = () => {
        img.src = reader.result;
      };

      reader.readAsDataURL(this.file);
    },

    deleteFile() {
      this.file = {};
      this.$refs['fileField'].reset();
    },
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
