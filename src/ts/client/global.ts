"use strict";

declare let require:any;

let Raven = require("raven-js");

Raven.config(
    "#SENTRY_JS#",
    {
      logger: "#PACKAGE_NAME#",
      release: "#PACKAGE_VERSION#",
      environment: process.env.NODE_ENV
    }
).install();

import AnimationFrame from "AnimationFrame";

import Utils from "Utils";

import Share from "./Share";

class Main {

  private pageMain:any;

  constructor() {
    this.initForm();
    this.initScrollAnimation();
    this.initLogotype();
    this.initLeadButtons();
    this.initMenuItems();
    this.initUpdateScroll();
    this.initShare();
  }

  private initLogotype() {
    let logotype:any = window.document.querySelector(".logotype--header");

    let logotypeHandler = (e, logotype) => {
      e.preventDefault();

      window.document.querySelector("a[href='#about']").click();
    };

    logotype.addEventListener("click", (e) => {
      logotypeHandler(e, logotype);
    });
    logotype.addEventListener("mousedown", (e) => {
      logotypeHandler(e, logotype);
    });
    logotype.addEventListener("mouseup", (e) => {
      logotypeHandler(e, logotype);
    });
    logotype.addEventListener("touchstart", (e) => {
      logotypeHandler(e, logotype);
    });
    logotype.addEventListener("touchend", (e) => {
      logotypeHandler(e, logotype);
    });
    logotype.addEventListener("touchcancel", (e) => {
      logotypeHandler(e, logotype);
    });
    logotype.addEventListener("touchmove", (e) => {
      logotypeHandler(e, logotype);
    });
  }

  private initUpdateScroll() {
    let updateScroll = () => {
      window.document.querySelector(".menu__item--active a").click();
    };

    window.addEventListener("resize", updateScroll.bind(window));
    window.addEventListener("orientationchange", updateScroll.bind(window));

    updateScroll();
  }

  private initForm() {
    let form:any = window.document.getElementById("cv-form");
    let input:any = form.querySelector(".form__file-input");
    let label:any = form.querySelector(".form__file-label");

    let clearInputClasses = () => {
      input.classList.remove("form__file-input--error");
      input.classList.remove("form__file-input--sending");
      input.classList.remove("form__file-input--done");
      input.classList.remove("form__file-input--focus");
    };

    let inputError = () => {
      clearInputClasses();
      input.classList.add("form__file-input--error");
      label.innerHTML = "&#128206; &nbsp; Прикрепить файл с рэзюме (pdf)";
    };

    input.addEventListener("click", () => {
      clearInputClasses();
      input.classList.add("form__file-input--focus");
      label.innerHTML = "&#128206; &nbsp; Прикрепить файл с рэзюме (pdf)";
    });

    input.addEventListener("change", () => {
      if (
          input.files &&
          input.files.length > 0 &&
          input.files[0].name.indexOf(".pdf") !== -1
      ) {
        clearInputClasses();
        input.classList.add("form__file-input--sending");
        label.innerHTML = "&#128206; &nbsp; " + input.files[0].name;

        let formData = new FormData();

        formData.append("cv", input.files[0]);

        let xhr = new XMLHttpRequest();

        xhr.open("POST", location.href, true);

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status == 200) {
              clearInputClasses();
              input.classList.add("form__file-input--done");

              setTimeout(
                  () => {
                    form.classList.add("form--done");
                  },
                  1000
              );
            } else {
              inputError();
            }
          }
        };

        xhr.send(formData);
      } else {
        inputError();
      }
    });
  }

  private initScrollAnimation() {
    this.pageMain = window.document.querySelector(".page__main");
    this.pageMain._topScroll = 0;
    this.pageMain._endScrollTime = 0;

    AnimationFrame.serialSubscribe({
      context: this,
      callback: () => {
        let now = Date.now() - this.pageMain._endScrollTime;

        if (now < 1000) {
          this.pageMain.scrollTop = Utils.Animation.Easing.easeInOutCubic(now, this.pageMain._startScroll, this.pageMain._endScroll, 1000);
        }
      }
    });
  }

  private initLeadButtons() {
    let leadButtons:any = window.document.querySelectorAll(".button--lead");

    let leadButtonsHandler = (e, leadButton) => {
      e.preventDefault();

      window.document.querySelector("a[href='#form']").click();
    };

    for (let i = 0; i < leadButtons.length; i++) {
      leadButtons[i].addEventListener("click", (e) => {
        leadButtonsHandler(e, leadButtons[i]);
      });
      leadButtons[i].addEventListener("mousedown", (e) => {
        leadButtonsHandler(e, leadButtons[i]);
      });
      leadButtons[i].addEventListener("mouseup", (e) => {
        leadButtonsHandler(e, leadButtons[i]);
      });
      leadButtons[i].addEventListener("touchstart", (e) => {
        leadButtonsHandler(e, leadButtons[i]);
      });
      leadButtons[i].addEventListener("touchend", (e) => {
        leadButtonsHandler(e, leadButtons[i]);
      });
      leadButtons[i].addEventListener("touchcancel", (e) => {
        leadButtonsHandler(e, leadButtons[i]);
      });
      leadButtons[i].addEventListener("touchmove", (e) => {
        leadButtonsHandler(e, leadButtons[i]);
      });
    }
  }

  private initMenuItems() {
    let menuItems:any = window.document.querySelectorAll(".menu__item a");

    let menuItemsHandler = (e, menuItem) => {
      e.preventDefault();

      this.pageMain._startScroll = this.pageMain.scrollTop;

      this.pageMain._endScroll = window.document.querySelector("#" + menuItem.href.split("#").pop()).getBoundingClientRect().top;

      this.pageMain._endScrollTime = Date.now();

      for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].parentElement.classList.remove("menu__item--active");
      }

      menuItem.parentElement.classList.add("menu__item--active");
    };

    for (let i = 0; i < menuItems.length; i++) {
      menuItems[i].addEventListener("click", (e) => {
        menuItemsHandler(e, menuItems[i]);
      });
      menuItems[i].addEventListener("mousedown", (e) => {
        menuItemsHandler(e, menuItems[i]);
      });
      menuItems[i].addEventListener("mouseup", (e) => {
        menuItemsHandler(e, menuItems[i]);
      });
      menuItems[i].addEventListener("touchstart", (e) => {
        menuItemsHandler(e, menuItems[i]);
      });
      menuItems[i].addEventListener("touchend", (e) => {
        menuItemsHandler(e, menuItems[i]);
      });
      menuItems[i].addEventListener("touchcancel", (e) => {
        menuItemsHandler(e, menuItems[i]);
      });
      menuItems[i].addEventListener("touchmove", (e) => {
        menuItemsHandler(e, menuItems[i]);
      });
    }
  }

  private initShare() {
    let shareButtons = window.document.querySelectorAll(".share-buttons");
    for (let shareButton of shareButtons) {
      new Share(shareButton);
    }
  }
}

new Main();
