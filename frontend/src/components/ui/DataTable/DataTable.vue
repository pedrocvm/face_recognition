<template>
  <div class="uploadsTableWrapper">
    <div class="searchWrapper">
      <TextField
        placeholder="Search"
        icon="search"
        :value="searchValue"
        @inputChange="handleSearch"
      />
    </div>

    <div class="tableWrapper">
      <el-table
        v-loading="$store.getters.getIsLoading"
        :data="
          displayData.filter((data) =>
            searchValue && searchValue.length >= 3
              ? data.name.toLowerCase().includes(searchValue.toLowerCase())
              : data
          )
        "
        style="width: 100%"
        border
        stripe
        lazy
        flexible
        max-height="100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column
          v-for="(header, index) of tableHeaders"
          :key="index"
          :label="header | capitalize"
          :prop="header"
          sortable
        >
        </el-table-column>

        <el-table-column
          v-if="$store.getters.getCurrentUser.role === '1'"
          label="Result"
          width="120"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <Button
              label="View result"
              size="tiny"
              type="primary"
              :minimal="true"
              @action="handleViewResult(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="Actions"
          width="80"
          align="center"
          fixed="right"
        >
          <template
            slot-scope="scope"
            v-if="
              $store.getters.getCurrentUser.role === '2'
                ? scope.row.role === 'Common'
                : true
            "
          >
            <Button
              label="Remove"
              size="tiny"
              type="error"
              :minimal="true"
              @action="$emit('delete', scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="tableData.length > pageSize"
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Button from '@/components/ui/Button/Button.vue';
import TextField from '@/components/ui/TextField/TextField.vue';

export default Vue.extend({
  name: 'DataTable',
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
  components: {
    Button,
    TextField,
  },
  data() {
    return {
      localTableData: [],
      currentPage: 1,
      pageSize: 5,
      searchValue: '',
    };
  },
  computed: {
    displayData() {
      if (!this.tableData || this.tableData.length === 0) {
        return [];
      }

      return this.tableData.slice(
        this.pageSize * this.currentPage - this.pageSize,
        this.pageSize * this.currentPage
      );
    },

    tableHeaders() {
      return this.$store.getters.getCurrentUser.role === '2'
        ? ['id', 'date', 'name', 'email', 'role', 'uploads']
        : ['id', 'name', 'date'];
    },
  },

  updated() {
    this.localTableData = this.tableData;
  },

  methods: {
    handleDelete(id) {
      const index = this.localTableData.findIndex((item) => item.id === id);

      this.localTableData.splice(index, 1);
    },

    handleCurrentChange(value) {
      this.page = value;
    },

    handleSearch(value) {
      this.searchValue = value;
    },

    handleViewResult(item) {
      this.$emit('viewUpload', item);
      this.$store.commit('setIsPreviewOpen', true);
    },
  },
});
</script>

<style lang="scss">
@import './styles';
</style>
