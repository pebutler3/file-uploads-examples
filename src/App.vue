<template>
  <div id="app">
    <file-pond-uploader />
    <uppy-uploader />
    <uploader :currentUpload="currentUpload" @image-uploaded="uploaded"/>
  </div>
</template>

<script>
import Uploader from "@/components/Uploader.vue";
import UppyUploader from "@/components/UppyUploader.vue";
import FilePondUploader from "@/components/FilePondUploader.vue";

export default {
  name: "App",
  components: {
    FilePondUploader,
    Uploader,
    UppyUploader
  },
  data() {
    return {
      currentUpload: null,
    };
  },
  methods: {
    uploaded({ image }) {
      this.currentUpload = image;
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
