<template>
  <!-- <div ref="resizeContainer" class="resize-container">
    <span class="resize-handle resize-handle-nw"></span>
    <span class="resize-handle resize-handle-ne"></span>
    <img ref="resizeImage" class="resize-image" src="img/image.jpg" alt="image for resizing" />
    <span class="resize-handle resize-handle-sw"></span>
    <span class="resize-handle resize-handle-se"></span>
  </div>-->
  <div ref="container" class="center">
    <img
      ref="cropImage"
      crossorigin="Anonymous"
      src="../../map_b_w.jpg"
      class="crop-image"
      alt
    />
    <button ref="btnCrop" class="btn-crop">Crop</button>
  </div>
</template>

<script>
export default {
  name: "Cropper",
  props: {
    currentUpload: {
      type: String,
    },
  },
  data() {
    return {
      wrapper: null,
      cropComponent: null,
      container: null,
      crop_img: null,
      eventState: {},
      ratio: 1.0,
      keyZoomValue: 4.0,
      MINWIDTH: 50,
      MINHEIGHT: 50,
      CROPWIDTH: 200,
      CROPHEIGHT: 200,
      cropLeft: 0,
      cropTop: 0,
      cropWidth: 0,
      cropHeight: 0,
      resize_canvas: null
    };
  },
  methods: {
    removeHandlers() {
      this.container.removeEventListener("mousedown", this.startMoving);
      this.container.removeEventListener("touchstart", this.startMoving);
      this.container.removeEventListener("wheel", this.resizing);

      this.$el.removeEventListener("mouseup", this.endMoving);
      this.$el.removeEventListener("touchend", this.endMoving);
      this.$el.removeEventListener("mousemove", this.moving);
      this.$el.removeEventListener("touchmove", this.moving);
      this.$el.removeEventListener("keypress", this.keyHandler);
    },
    addHandlers() {
      this.container.addEventListener("mousedown", this.startMoving, false);
      this.container.addEventListener("touchstart", this.startMoving, false);
      this.container.addEventListener("wheel", this.resizing, false);

      this.$el.addEventListener("keypress", this.keyHandler, false);
      this.$refs.btnCrop.addEventListener("click", this.openCropCanvasImg);
    },
    init(imageTarget) {
      let left;
      let top;

      if (imageTarget.dataset.isCrop) {
        throw "image is already crop";
      }

      imageTarget.dataset.isCrop = "true";
      imageTarget.classList.add("crop-blur");
      imageTarget.draggable = false;

      this.crop_img = new Image();
      this.crop_img.crossOrigin = imageTarget.crossOrigin;
      this.crop_img.src = imageTarget.src;
      this.crop_img.draggable = false;

      this.resize_canvas = document.createElement("canvas");

      this.cropComponent = document.createElement("div");
      this.cropComponent.classList.add("crop-component");

      this.container = document.createElement("div");
      this.container.classList.add("overlay");

      this.cropComponent.appendChild(this.container);
      this.wraper = imageTarget.parentNode;
      this.wraper.appendChild(this.cropComponent);
      this.cropComponent.appendChild(this.crop_img);
      this.cropComponent.appendChild(imageTarget);
      this.container.appendChild(this.crop_img);

      left = imageTarget.offsetWidth / 2 - this.CROPWIDTH / 2;
      top = imageTarget.offsetHeight / 2 - this.CROPHEIGHT / 2;

      console.log(left, top)
      this.updateCropImage(left, top);
      this.addHandlers();
    },
    updateCropSize(width, height) {
      this.container.style.width = width + "px";
      this.container.style.height = height + "px";
    },
    updateCropImage(left, top) {
      this.cropLeft = -left * this.ratio;
      this.cropTop = -top * this.ratio;
      left = -left + "px";
      top = -top + "px";

      this.crop_img.style.top = top;
      this.crop_img.style.left = left;
    },
    updateContainer(left, top) {
      top = top + this.CROPWIDTH / 2 + "px";
      left = left + this.CROPHEIGHT / 2 + "px";

      this.container.style.top = top;
      this.container.style.left = left;
    },
    saveEventState(e) {
      this.eventState.container_width = this.container.offsetWidth;
      this.eventState.container_height = this.container.offsetHeight;

      this.eventState.container_left = this.container.offsetLeft;
      this.eventState.container_top = this.container.offsetTop;

      // WINDOW?
      this.eventState.mouse_x =
        (e.clientX || e.pageX || (e.touches && e.touches[0].clientX)) +
        window.scrollX;
      this.eventState.mouse_y =
        (e.clientY || e.pageY || (e.touches && e.touches[0].clientY)) +
        window.scrollY;
    },
    imgZoom(zoom) {
      zoom = zoom * Math.PI * 2;
      var newWidth = Math.floor(this.container.clientWidth + zoom),
        newHeight = Math.floor(this.container.clientHeight + zoom),
        w = this.crop_img.clientWidth,
        h = this.crop_img.clientHeight,
        left,
        top,
        right,
        bottom;

      if (newWidth < this.MINWIDTH) {
        return;
      } else if (newWidth > w) {
        return;
      }

      left = this.container.offsetLeft - zoom / 2;
      top = this.container.offsetTop - zoom / 2;
      right = left + newWidth;
      bottom = top + newHeight;

      if (left < 0) {
        left = 0;
      }
      if (top < 0) {
        top = 0;
      }
      if (right > w) {
        return;
      }
      if (bottom > h) {
        return;
      }

      this.ratio = this.CROPWIDTH / newWidth;

      this.updateCropSize(newWidth, newWidth);
      this.updateCropImage(left, top);
      this.updateContainer(left, top);
      this.crop();
    },
    keyHandler(e) {
      e.preventDefault();

      switch (String.fromCharCode(e.charCode)) {
        case "+":
          this.imgZoom(this.keyZoomValue);
          break;
        case "-":
          this.imgZoom(-this.keyZoomValue);
          break;
      }
    },
    startMoving(e) {
      e.preventDefault();
      e.stopPropagation();

      this.saveEventState(e);

      this.$el.addEventListener("mousemove", this.moving);
      this.$el.addEventListener("touchmove", this.moving);
      this.$el.addEventListener("mouseup", this.endMoving);
      this.$el.addEventListener("touchend", this.endMoving);
    },
    endMoving(e) {
      e.preventDefault();

      this.$el.removeEventListener("mouseup", this.endMoving);
      this.$el.removeEventListener("touchend", this.endMoving);
      this.$el.removeEventListener("mousemove", this.moving);
      this.$el.removeEventListener("touchmove", this.moving);
    },
    resizing(e) {
      e.preventDefault();
      this.imgZoom(e.deltaY > 0 ? 1 : -1);
    },
    moving(e) {
      var currentTouch = {},
        left,
        top,
        w,
        h;

      e.preventDefault();
      e.stopPropagation();

      currentTouch.x = e.pageX || (e.touches && e.touches[0].pageX);
      currentTouch.y = e.pageY || (e.touches && e.touches[0].pageY);

      left =
        currentTouch.x -
        (this.eventState.mouse_x - this.eventState.container_left);
      top =
        currentTouch.y -
        (this.eventState.mouse_y - this.eventState.container_top);
      w = this.container.offsetWidth;
      h = this.container.offsetHeight;

      if (left < 0) {
        left = 0;
      } else if (left > this.crop_img.offsetWidth - w) {
        left = this.crop_img.offsetWidth - w;
      }
      if (top < 0) {
        top = 0;
      } else if (top > this.crop_img.offsetHeight - h) {
        top = this.crop_img.offsetHeight - h;
      }

      this.updateCropImage(left, top);
      this.updateContainer(left, top);
    },
    crop() {
      this.cropWidth = this.crop_img.width * this.ratio;
      this.cropHeight = this.crop_img.height * this.ratio;

      this.resize_canvas.width = this.CROPWIDTH;
      this.resize_canvas.height = this.CROPHEIGHT;

      var ctx = this.resize_canvas.getContext("2d");
      ctx.drawImage(
        this.crop_img,
        this.cropLeft,
        this.cropTop,
        this.cropWidth,
        this.cropHeight
      );
    },
    openCropCanvasImg() {
      this.crop();
      try {
        var base64Img = this.resize_canvas.toDataURL("image/png", 1.0);
        console.log(base64Img);
        window.open(base64Img);
      } catch (e) {
        alert(e);
      } finally {
        this.removeHandlers();
      }
    },
    resizeableImage(imageTarget) {
      imageTarget.complete
        ? this.init(imageTarget)
        : (imageTarget.onload = () => this.init(imageTarget));
    }
  },
  mounted() {
    // this.resizeableImage(this.$refs.resizeImage);
    this.resizeableImage(this.$refs.cropImage);
  }
};
</script>

<style>
body {
  margin: 0;
}
.overlay::selection {
  background: transparent;
}
.crop-component::selection {
  background: transparent;
}
/* .crop-blur {
  -webkit-filter: blur(10px) sepia(0.2);
  filter: blur(10px) sepia(0.2);
} */
.crop-image,
.overlay > img {
  width: auto;
  height: auto;
  /* можно явно указать либо ширину, либо высоту */
  width: 500px;
  /*либо height: 300px;*/
  display: block;
  object-fit: contain;
  object-position: center;
}
/*add stretch*/
.crop-image {
  display: block;
  position: relative;
  pointer-events: none;
}
/*add stretch*/
.overlay > img {
  position: absolute;
  display: block;
}
.crop-component {
  position: relative;
  display: table;
  z-index: 999;
  background-color: white;
  margin: 0 auto;
  overflow: hidden;
  border: white 3px solid;
}
.overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 999;
  margin-left: -100px;
  margin-top: -100px;
  width: 200px;
  height: 200px;
  box-shadow: 0 0 0 3px white;
  overflow: hidden;
  box-sizing: content-box;
}
.overlay:hover,
.overlay:active {
  cursor: move;
}
.btn-crop {
  position: fixed;
  right: 5px;
  bottom: 5px;
  vertical-align: bottom;
  padding: 6px 10px;
  z-index: 999;
  background-color: #de3c50;
  border: none;
  border-radius: 5px;
  color: #fff;
}
.btn-crop img {
  vertical-align: middle;
  margin-left: 8px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background: #eaeaea;
}
</style>