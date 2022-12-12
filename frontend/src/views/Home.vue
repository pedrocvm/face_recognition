<template>
  <Container>
    <div class="homeWrapper">
      <UploadForm v-if="!isAdmin" @upload="uploadFile" />

      <section class="contentWrapper">
        <Title :text="isAdmin ? 'User list' : 'My uploads'" size="large" />
        <DataTable
          ref="data-table"
          :tableData="isAdmin ? userListData : uploadListData"
          @delete="handleDeleteItem"
          @viewUpload="viewUpload"
        />
      </section>
      <ImagePreview />
    </div>
  </Container>
</template>
z
<script>
import Vue from 'vue';
import Container from '@/components/structure/Container/Container.vue';
import Title from '@/components/ui/Title/Title.vue';
import UploadForm from '@/components/ui/UploadForm/UploadForm.vue';
import DataTable from '@/components/ui/DataTable/DataTable.vue';
import ImagePreview from '@/components/ui/ImagePreview/ImagePreview.vue';
import dateTimeFormat from '@/utils/dateTimeFormat';

export default Vue.extend({
  name: 'Home',
  components: {
    Container,
    Title,
    UploadForm,
    DataTable,
    ImagePreview,
  },

  computed: {
    isAdmin() {
      return this.$store.getters.getCurrentUser.role === '2';
    },

    userListData() {
      const userList = this.$store.getters.getUserList;

      if (!!userList.length) {
        return this.$store.getters.getUserList.map((item) => {
          const { id, name, email, role, uploads, createdAt } = item;
          return {
            id,
            date: dateTimeFormat(createdAt),
            name,
            email,
            role: role === '1' ? 'Common' : 'Admin',
            uploads: uploads.length,
          };
        });
      } else {
        return [];
      }
    },

    uploadListData() {
      const uploadList = this.$store.getters.getUploadList;

      if (!!uploadList.length) {
        return this.$store.getters.getUploadList.map((item) => {
          const { id, name, data, createdAt } = item;
          return {
            id,
            name,
            date: dateTimeFormat(createdAt),
            data,
          };
        });
      } else {
        return [];
      }
    },
  },

  mounted() {
    this.$store.getters.getCurrentUser.role === '1'
      ? this.$store.dispatch('getUploads')
      : this.$store.dispatch('getAllUsers');
  },

  methods: {
    async uploadFile(file) {
      const response = await this.$store.dispatch('createUpload', file);

      if (!!response && !!response.error) {
        this.$alert(`${response.error}`, 'Error', {
          confirmButtonText: 'OK',
          callback: () => {
            this.$message({
              type: 'error',
              message: `${response.error}. Upload failed.`,
            });
          },
        });
      }
    },

    viewUpload(upload) {
      const index = this.$store.getters.getUploadList.findIndex(
        (item) => item.id === upload.id
      );

      this.selectedUpload = this.$store.getters.getUploadList[index];
      this.$store.commit('setSelectedUpload', this.selectedUpload);
    },

    handleDeleteItem(id) {
      this.$store.getters.getCurrentUser.role === '1'
        ? this.deleteUpload(id)
        : this.deleteUser(id);
    },

    deleteUser(id) {
      this.$confirm(
        'This will permanently delete the User. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
        }
      )
        .then(() => {
          this.$refs['data-table'].handleDelete(id);
          this.$store.dispatch('deleteUser', id);

          this.$message({
            type: 'success',
            message: 'Successfully deleted User',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
          });
        });
    },

    deleteUpload(id) {
      this.$confirm(
        'This will permanently delete the Request. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
        }
      )
        .then(() => {
          this.$refs['data-table'].handleDelete(id);

          this.$store.dispatch('deleteUpload', id);

          this.$message({
            type: 'success',
            message: 'Successfully deleted Request',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
          });
        });
    },
  },
});
</script>

<style lang="scss">
@import '@/sass/master';

.homeWrapper {
  margin: map-get($spacings, small) 0;

  .contentWrapper {
    margin-top: map-get($spacings, medium);
    @include flexbox(column, center, center, map-get($spacings, small));
  }
}
</style>
