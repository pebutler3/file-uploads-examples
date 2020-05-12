<template>
  <div class="uploader">
    <h2>No Framework</h2>
    <input type="file" @change="fileselected" />
    <!-- <img v-if="currentUpload" :src="currentUpload" width="auto" /> -->
    <div v-if="loading">loading...</div>
  </div>
</template>

<script>
export default {
  name: "Uploader",
  props: {
    currentUpload: {
      type: String,
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    fileselected(e) {
      const file = e.target.files.item(0);
      const reader = new FileReader();
      reader.addEventListener("load", this.imageloaded);
      reader.readAsDataURL(file);
      console.log(file)
    },
    imageloaded(e) {
      this.$emit('image-uploaded', { image: e.target.result });
    }
  }
};
</script>

<style>
</style>