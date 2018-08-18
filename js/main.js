"use strict";
(function () {

  // Не могу сообразить как сделать работающий круговой слайдер,
  // но могу его нарисовать
  const canvas = document.querySelector(`canvas`);
  const drawCanvasRadialSlider = () => {
    const ctx = canvas.getContext(`2d`);

    const colorYellow = `#F0C376`;
    const dotsPerCircle = 120;
    const interval = (Math.PI * 2) / dotsPerCircle;
    const centerX = 110.5;
    const centerY = 110.5;
    const radius = 111;

    for (let i = 0; i < dotsPerCircle; i++) {
      const desiredRadianAngleOnCircle = interval * i;
      const x = centerX + radius * Math.cos(desiredRadianAngleOnCircle);
      const y = centerY + radius * Math.sin(desiredRadianAngleOnCircle);
      ctx.strokeStyle = colorYellow;

      // Закрашивает черным неактивную часть слвйдера
      if (i > 4 && i < 21) {
        ctx.strokeStyle = `#000`;
      }

      // Закрашивает белым отусутствующую часть слвйдера
      if (i > 20 && i < 40) {
        ctx.strokeStyle = `#fff`;
      }

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Тень круга
    ctx.fillStyle = `rgba(0,0,0,.35)`;
    ctx.strokeStyle = `#fff`;
    ctx.beginPath();
    ctx.arc(108, 113, 87, 0, Math.PI * 2, false);
    ctx.fill();

    // Фронтальный круг
    ctx.fillStyle = `#fefefe`;
    ctx.strokeStyle = `rgba(0,0,0,.15)`;
    ctx.beginPath();
    ctx.arc(110, 109, 87, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();

    // Показатель температуры
    ctx.fillStyle = `#000`;
    ctx.font = `bold 66px Arial`;
    ctx.fillText(`+23`, 54, 136);

    // Бегунок слвйдера
    ctx.beginPath();
    ctx.moveTo(189, 128);
    ctx.lineTo(194, 135);
    ctx.lineTo(186, 138);
    ctx.closePath();
    ctx.fill();
  };
  drawCanvasRadialSlider();

  const ESC_KEYCODE = 27;

  const warmFloorCard = document.querySelector(`.js-warm-floor`);
  const bodyNode = document.querySelector(`body`);
  const mainNode = bodyNode.querySelector(`main`);
  const footerNode = bodyNode.querySelector(`footer`);
  const headerNode = bodyNode.querySelector(`header`);

  const favouritesNode = document.querySelector(`.favourites`);
  const favScrollBtns = favouritesNode.querySelectorAll(`button`);
  const deviceCardNodes = favouritesNode.querySelectorAll(`.device-card`);
  const favDeviceList = favouritesNode.querySelector(`.device-list--favourites`);

  const modalNode = document.querySelector(`.modal`);
  const modalContent = modalNode.querySelector(`.modal__content`);
  const modalContentTitle = modalContent.querySelector(`.modal__text-title`);
  const modalContentSubtitle = modalContent.querySelector(`.modal__text-subtitle`);
  const modalSlider = modalNode.querySelector(`.modal__slider`);
  const modalSliderOutput = modalNode.querySelector(`.modal__slider-output`);
  const modalBtns = modalNode.querySelectorAll(`.modal__btn`);
  const modalIcons = modalNode.querySelectorAll(`.modal__slider-icon`);
  const modalSliderIndicator = modalNode.querySelector(`.modal__slider-indicator`);
  const modalRadioContainer = modalNode.querySelector(`.modal__text-radio-container`);
  const modalRadioBtns = modalNode.querySelectorAll(`.modal__text-radio-container li label`);
  const modalRadioInputs = modalNode.querySelectorAll(`.modal__text-radio-container li input`);


  const onModalOpen = () => {
    mainNode.style.filter = `blur(5px)`;
    footerNode.style.filter = `blur(5px)`;
    headerNode.style.filter = `blur(5px)`;
    bodyNode.style.overflow = `hidden`; // Отменяет тач-скролл страницы при перемещении вертикального слайдера в модальном окне
    modalNode.style.display = `flex`;

    modalContent.style.opacity = 0;
    const animatePopup = function () {
      if (modalContent.style.opacity < 1) {
        modalContent.style.opacity = parseFloat(modalContent.style.opacity) + 0.01;
      }
      if (modalContent.style.opacity >= 1) {
        return;
      } else {
        setTimeout(animatePopup, 1);
      }
    };
    animatePopup();
  };

  const onModalClose = () => {
    // Обнуляет все изменения
    mainNode.style.filter = ``;
    footerNode.style.filter = ``;
    headerNode.style.filter = ``;
    modalNode.style.display = ``;
    bodyNode.style.overflow = ``;
    modalSlider.className = `modal__slider`;
    modalSlider.disabled = false;
    modalSlider.value = 16;
    modalIcons.forEach((el) => {
      el.style = ``;
      el.textContent = ``;
    });

    modalRadioContainer.style.visibility = ``;
    canvas.style.display = ``;

    modalRadioBtns[1].textContent = `Холодно`;
    modalRadioBtns[2].textContent = `Тепло`;
    modalRadioBtns[3].textContent = `Жарко`;

    modalRadioInputs[0].checked = true;
    modalSliderOutput.style.display = ``;
    modalSliderIndicator.style.backgroundImage = `url("img/svg/icon_temperature_active.svg")`;

    document.querySelector(`.modal__slider-output`).value = `+23`;
  };

  // Добавляет `+` при значении слайдера > 0
  modalSlider.addEventListener(`input`, () => {
    if (modalSlider.value > 0) {
      modalSliderOutput.value = `+${modalSlider.value}`;
    }
  });

  deviceCardNodes.forEach((el) => {

    el.addEventListener(`click`, (evt) => {
      const isTemperatureCard = evt.target.querySelector(`.device-card__icon use`).getAttribute(`xlink:href`).startsWith(`#icon_temperature`);
      const evtTargetTitle = evt.target.querySelector(`.device-card__text-title`).textContent;
      const evtTargetSubtitle = evt.target.querySelector(`.device-card__text-subtitle`).textContent;

      onModalOpen();
      modalSlider.style.display = ``;
      modalContentTitle.textContent = evtTargetTitle;
      modalContentSubtitle.textContent = evtTargetSubtitle;
      canvas.style.display = `none`;
      modalIcons.forEach((elm) => {
        elm.style.display = ``;
      });

      if (isTemperatureCard) {
        modalSlider.classList.add(`modal__slider--temp`);
        modalIcons[0].textContent = `+30`;

        modalIcons[1].textContent = `-10`;
        modalIcons.forEach((element) => {
          element.style.backgroundImage = `none`;
        });
        modalSliderIndicator.style.backgroundImage = `url("img/svg/icon_temperature_active.svg")`;

      } else {
        modalSlider.classList.add(`modal__slider--light`);
        modalRadioBtns[1].textContent = `Дневной свет`;
        modalRadioBtns[2].textContent = `Вечерний свет`;
        modalRadioBtns[3].textContent = `Рассвет`;
        modalSliderIndicator.style.backgroundImage = `url("img/svg/icon_sun_inactive.svg")`;
        modalSliderOutput.style.display = `none`;
      }
    });
  });

  modalRadioContainer.addEventListener(`change`, (evt) => {
    modalSlider.disabled = false;
    switch (evt.target) {
      case modalRadioInputs[1]:
        modalSlider.value = 5;
        modalSliderOutput.value = `+5`;
        modalSlider.disabled = true;
        break;
      case modalRadioInputs[2]:
        modalSlider.value = 20;
        modalSliderOutput.value = `+20`;
        modalSlider.disabled = true;
        break;
      case modalRadioInputs[3]:
        modalSlider.value = 28;
        modalSliderOutput.value = `+28`;
        modalSlider.disabled = true;
        break;
        // Мне показалось логичным, что если есть опция `вручную`, то остальные
        // кнопки должны отключать возможность редактирования инпута,
        // но это не точно
    }
  });

  warmFloorCard.addEventListener(`click`, () => {
    onModalOpen();
    modalContentTitle.textContent = `Xiaomi Warm Floor`;
    modalContentSubtitle.textContent = `Включено`;
    modalSlider.style.display = `none`;
    modalRadioContainer.style.visibility = `hidden`;
    // vis=`hidden` - чтобы элемент остался на месте и верстка карточки не поехала
    modalIcons.forEach((el) => {
      el.style.display = `none`;
    });
  });

  modalBtns.forEach((el) => {
    el.addEventListener(`click`, () => {
      onModalClose();
    });
  });

  modalContent.addEventListener(`click`, (evt) => {
    evt.stopPropagation();
  });

  modalNode.addEventListener(`click`, () => {
    onModalClose();
  });

  window.addEventListener(`keydown`, (evt) => {
    if (evt.keyCode === ESC_KEYCODE) {
      onModalClose();
    }
  });

  const sideScroll = (element, direction, speed, distance, step) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(function () {
      if (direction === `left`) {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  };
  // Вешает обработчики клика на кнопки горизонтального пролистывания секции избр.устройств
  favScrollBtns[0].addEventListener(`click`, () => {
    sideScroll(favDeviceList, `left`, 10, 215, 10);
  });

  favScrollBtns[1].addEventListener(`click`, () => {
    sideScroll(favDeviceList, `right`, 10, 215, 10);
  });

})();
