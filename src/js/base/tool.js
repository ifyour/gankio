var tool = {
  /**
   * [setWechatTitle description] 设置微信title
   * @param {[type]} title [description]
   */
  setWechatTitle(title, img) {
    if (title === undefined || window.document.title === title) {
      return;
    }
    document.title = title;
    var mobile = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(mobile)) {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      // 替换成站标favicon路径或者任意存在的较小的图片即可
      iframe.setAttribute('src', img || '/favicon.ico');
      var iframeCallback = function() {
        setTimeout(function() {
          iframe.removeEventListener('load', iframeCallback);
          document.body.removeChild(iframe);
        }, 0);
      };
      iframe.addEventListener('load', iframeCallback);
      document.body.appendChild(iframe);
    }
  }
};

module.exports = tool;
