<template>
  <div>
    <h2><a href="https://github.com/pqina/vue-filepond">Vue FilePond</a></h2>
    <!-- ADD server attribute to <FilePond> e.g. http://localhost:8080/api -->
    <!-- I used https://beeceptor.com -->
    <FilePond
      ref="pond"
      server=""
      :files="myFiles"
      @change="handleFilePondInit"
    />
  </div>
</template>

<script>
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";

export default {
  name: "FilePondUploader",
  components: {
    FilePond: vueFilePond()
  },
  data() {
    return {
      myFiles: []
    };
  },
  computed: {
    ponds() {
      return this.$refs.pond;
    }
  },
  methods: {
    handleFilePondInit() {
      console.log("FilePond has initialized");

      // example of instance method call on pond reference
      return this.$refs.pond.getFiles();
    }
  }
};
</script>

<style>
</style>