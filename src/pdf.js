/* eslint-disable no-await-in-loop */
import PDFJS from 'pdfjs-dist';

class Pdf2Image {
  /**
   * @param {string} pdfUrl
   * @return {Pdf2Image} Returns an instance of
   */
  static async open(pdfUrl) {
    const pdfDoc = await PDFJS.getDocument({ url: pdfUrl }).promise;
    return new Pdf2Image(pdfDoc);
  }

  /**
   * @param {PDFJS.PDFDocumentProxy} pdfDoc
   */
  constructor(pdfDoc) {
    this.pdfDoc = pdfDoc;
  }

  /**
   * @return {Number}
   */
  numPages() {
    return this.pdfDoc.numPages;
  }

  /**
   * Makes the specified page of the image an image and returns the DataUrl of the image
   * @param {Number} pageNo page number(1〜)
   * @param {Object} option
   *                  {scale: image scale factor}, scales the image by a specified scale factor
   *                  {width: maximum width, height: maximum height} Make the image a size that fits in the specified area
   *                  {image: 'jpeg | webp | png |'} Image format
   * @return {String} DataUrl of page image
   */
  async getImageDataUrl(pageNo, option) {
    const page = await this.pdfDoc.getPage(pageNo);
    const scale = Pdf2Image.calcScale(page, option);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvasContext.height = viewport.height;
    canvasContext.width = viewport.width;

    const renderContext = {
      canvasContext,
      viewport,
    };
    await page.render(renderContext).promise;
    switch (option.image) {
      case 'jpeg':
        return canvas.toDataURL('image/jpeg');
      case 'webp':
        return canvas.toDataURL('image/webp');
      default:
        return canvas.toDataURL();
    }
  }

  /**
   *
   * @param {PDFJS.PDFPageProxy} page
   * @param {Object} option
   *                  {scale: image scale factor}, scales the image by a specified scale factor
   *                  {width: maximum width, height: maximum height} Make the image a size that fits in the specified area
   * @return {Number} magnification
   */
  static calcScale(page, option) {
    if (option.scale !== undefined) {
      return option.scale;
    }
    if (option.width === undefined || option.height === undefined) {
      return 1.0;
    }
    const viewport = page.getViewport({ scale: 1.0 });
    return Math.min(option.width / viewport.width, option.height / viewport.height);
  }

  /**
   * PDF Image all pages in and return the DataUrl of the image
   * @param {Object} option
   *                  {scale: image scale factor}, scales the image by a specified scale factor
   *                  {width: maximum width, height: maximum height} Make the image a size that fits in the specified area
   * @return {String[]} DataUrl of page image
   */
  async getAllImageDataUrl(option) {
    const pages = [];
    const numPages = this.numPages();
    for (let i = 1; i <= numPages; i += 1) {
      const img = await this.getImageDataUrl(i, option);
      pages.push(img);
    }
    return pages;
  }
}

export default Pdf2Image;
