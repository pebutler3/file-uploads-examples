<template>
  <div class="grid">
    <h2><a href="https://uppy.io">uppy.io</a></h2>
    <div class="column-full">
      <div class="UppyInput"></div>
      <div class="UppyInput-Progress"></div>
    </div>
  </div>
</template>

<script>
import Uppy from "@uppy/core";
import FileInput from "@uppy/file-input";
import StatusBar from "@uppy/status-bar";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/status-bar/dist/style.css";
import "@uppy/file-input/dist/style.css";

const uppy = new Uppy({
  id: "uppy",
  autoProceed: true,
  allowMultipleUploads: true,
  debug: true,
  // restrictions: {
  //   maxFileSize: null,
  //   maxNumberOfFiles: null,
  //   minNumberOfFiles: null,
  //   allowedFileTypes: null
  // },
  meta: {
    filename: "test"
  },
  onBeforeFileAdded: currentFile => {
    return currentFile;
  }
  // locale: {}
});

export default {
  name: "UppyUploader",
  mounted() {
    uppy.use(FileInput, { target: ".UppyInput", pretty: true });
    uppy.use(XHRUpload, {
      endpoint: "https://pbkills.free.beeceptor.com",
    });
    uppy.use(StatusBar, {
      target: ".UppyInput-Progress",
      hideUploadButton: true,
      hideAfterFinish: false
    });
  }
};
</script>

<style>
.uppy-Root {
  text-align: center;
}
</style>