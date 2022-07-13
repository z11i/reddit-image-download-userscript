// ==UserScript==
// @name        Download Reddit images
// @description Adds a button to download original images uploaded to a Reddit post
// @version     0.1
// @downloadURL https://raw.githubusercontent.com/z11i/reddit-image-download-userscript/main/reddit.user.js
// @updateURL   https://raw.githubusercontent.com/z11i/reddit-image-download-userscript/main/reddit.user.js
// @match       *://www.reddit.com/*
// @grant       GM_addStyle
// ==/UserScript==

function downloadURI(blob, name) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  // the filename you want
  a.download = name;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

function initRedditDownload() {
  const urls = [...document.querySelectorAll('div[data-test-id="post-content"] figure img')].map(x => {
    const url = new URL(x.src);
    const origin = url.origin.replace('preview', 'i');
    console.log(origin, url.pathname);
    return [`${origin}${url.pathname}`, url.pathname];
  });
  urls.forEach(u => {
    fetch(u[0]).then(r => r.blob()).then(b => downloadURI(b, u[1]));
  });
}

const elementToObserve = document.querySelector('div[data-test-id="post-content"]');
(new MutationObserver(check)).observe(elementToObserve, {
  childList: true,
  subtree: true
});

function check(changes, observer) {
  if (document.querySelector('._3-miAEojrCvx_4FQ8x3P-s')) {
    observer.disconnect();
    // code
    var zNode = document.createElement('div');
    zNode.innerHTML = '<button id="redditDownloadImages" type="button">⏬</button>';
    zNode.setAttribute('id', 'redditDownloadImagesContainer');
    zNode.setAttribute('class', '_3U_7i38RDPV5eBv7m4M-9J');
    document.querySelector('._3-miAEojrCvx_4FQ8x3P-s').appendChild(zNode);

    //--- Activate the newly added button.
    document.getElementById("redditDownloadImages").addEventListener(
      "click", initRedditDownload, false
    );
  }
}
