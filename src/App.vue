<template>
  <div id="app">
    <input type="file" accept="application/pdf, image/*" v-on:change="onFileChange">
    <div v-show="isLoading">Loading</div>
    <!-- <div v-for="image in images" v-bind:key="image">
      <img v-bind:src="image">
    </div> -->
    <!-- <file-pond-uploader />
    <uppy-uploader /> -->
    <uploader :currentUpload="currentUpload" @image-uploaded="uploaded" />
    <!-- <cropper :currentUpload="currentUpload" /> -->
    <cropper
      class="cropper"
      ref="cropper"
      :src="currentUpload"
      :stencilProps="{ aspectRatio: 10/12 }"
    ></cropper>
    <button @click="crop()">
      CROP
      <span>&#x2316;</span>
    </button>
  </div>
</template>

<script>
// import Cropper from "@/components/Cropper.vue";
import Uploader from "@/components/Uploader.vue";
// import UppyUploader from "@/components/UppyUploader.vue";
// import FilePondUploader from "@/components/FilePondUploader.vue";
import { Cropper } from "vue-advanced-cropper";
import Pdf2Image from './pdf';

export default {
  name: "App",
  components: {
    Cropper,
    // FilePondUploader,
    Uploader,
    // UppyUploader
  },
  data() {
    return {
      currentUpload: null,
      currentUploadType: null,
      isLoading: false,
    };
  },
  computed: {
    isFilePdf() {
      return this.currentUploadType === 'application/pdf';
    },
  },
  methods: {
    async onFileChange(e) {
      console.log(e)
      this.currentUploadType = e.target.files[0].type;
      this.isLoading = true;

      if (this.isFilePdf) {
        try {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          const pdf2image = await Pdf2Image.open(url);
          // const images = await pdf2image.getAllImageDataUrl({scale:2.0});
          const images = await pdf2image.getAllImageDataUrl({ width: 400, height: 400 });
          this.currentUpload = images[0];
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('shiiit')
      }
      this.isLoading = false;
    },
    uploaded({ image }) {
      this.currentUpload = image;
    },
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
			this.coordinates = coordinates
			// You able to do different manipulations at a canvas
      // but there we just get a cropped image
			this.currentUpload = canvas.toDataURL("image/png", 1.0)
    }
  },
  mounted() {
    // console.log(pdfjs);
  }
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

button {
  margin-top: 20px;
}

button span {
  font-size: 14px;
}
</style>
