"use strict";

export default class Share {
  constructor(shareButtons) {
    let buttons = shareButtons.querySelectorAll(".share-buttons__items");
    for (let button of buttons) {
      button.addEventListener("click", (e) => {
        let type = button.getAttribute("data-type");
        let title;
        let description;
        let img;
        let u;

        if (button.parentElement.getAttribute("data-title")) {
          title = button.parentElement.getAttribute("data-title");
        } else if (window.document.querySelector("meta[type='og:title']")) {
          title = window.document.querySelector("meta[type='og:title']").getAttribute("content");
        } else if (window.document.querySelector(".og-title")) {
          title = window.document.querySelector(".og-title").getAttribute("data-title");
        } else {
          title = window.document.querySelector("title").innerText;
        }

        if (button.parentElement.getAttribute("data-description")) {
          description = button.parentElement.getAttribute("data-description");
        } else if (window.document.querySelector("meta[type='og:description']")) {
          description = window.document.querySelector("meta[type='og:description']").getAttribute("content");
        } else if (window.document.querySelector("meta[type='description']")) {
          description = window.document.querySelector("meta[type='description']").getAttribute("content");
        } else if (window.document.querySelector(".og-description")) {
          description = window.document.querySelector(".og-description").getAttribute("data-description");
        } else {
          description = "";
        }

        if (button.parentElement.getAttribute("data-image")) {
          img = button.parentElement.getAttribute("data-image");
        } else if (window.document.querySelector("meta[type='og:image']")) {
          img = window.document.querySelector("meta[type='og:image']").getAttribute("content");
        } else if (window.document.querySelector(".og-image")) {
          img = window.document.querySelector(".og-image").getAttribute("data-image");
        } else if (window.document.querySelector(".logo img")) {
          img = location.protocol + "//" + location.host + window.document.querySelector("link[rel='icon'][sizes='192x192']").getAttribute("href");
        }

        if (button.parentElement.getAttribute("data-url")) {
          u = button.parentElement.getAttribute("data-url");
        } else {
          u = location.href;
        }

        let url = '';
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        let k = '';
        for (let i = 0; i < 5; i++) {
          k += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        url = '';
        url += 'http://share.pluso.ru/process?';
        url += 'act=share';
        url += '&u=' + encodeURIComponent(u);
        url += '&w=' + screen.width;
        url += '&h=' + screen.height;
        url += '&ref=';
        url += '&uid=1364166423835';
        url += '&k=' + k;
        url += '&type=' + type;
        url += '&t=' + encodeURIComponent(title);
        url += '&s=' + encodeURIComponent(description);
        url += '&img=' + encodeURIComponent(img);

        window.open(url, type, 'toolbar=0,status=0,width=' + Math.min(626, screen.width) + ',height=' + Math.min(436, screen.height) + '');

        e.preventDefault();
      });
    }
  }
}
