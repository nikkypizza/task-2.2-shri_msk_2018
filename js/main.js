"use strict";

// Не могу сообразить как сделать работающий круговой слайдер,
// но могу нарисовать его на канвасе
const drawCanvasRadialSlider = () => {
  const canvas = document.querySelector(`canvas`);
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
  ctx.strokeStyle = `#fff`;
  ctx.fillStyle = `rgba(0,0,0,.35)`;
  ctx.beginPath();
  ctx.arc(108, 113, 87, 0, 2 * Math.PI, false);
  ctx.fill();

  // Фронтальный круг
  ctx.fillStyle = `#fefefe`;
  ctx.strokeStyle = `rgba(0,0,0,.15)`;
  ctx.beginPath();
  ctx.arc(110, 109, 87, 0, 2 * Math.PI, false);
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
const deviceCardNodes = favouritesNode.querySelectorAll(`.device-card`);

const modalNode = document.querySelector(`.modal`);
const modalContent = modalNode.querySelector(`.modal__content`);
const modalSlider = modalNode.querySelector(`.modal__slider`);
const modalBtns = modalNode.querySelectorAll(`.modal__btn`);
const modalIcons = modalNode.querySelectorAll(`.modal__slider-icon`);
const modalRadioContainer = modalNode.querySelector(`.modal__text-radio-container`);
const modalRadioBtns = modalNode.querySelectorAll(`.modal__text-radio-container li label`);
const modalRadioInputs = modalNode.querySelectorAll(`.modal__text-radio-container li input`);

const onModalClose = () => {
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
  modalContent.querySelector(`.modal__text-radio-container`).style.visibility = ``;
  modalContent.querySelector(`.canvas`).style.display = ``;

  modalRadioBtns[1].textContent = `Холодно`;
  modalRadioBtns[2].textContent = `Тепло`;

  modalRadioInputs[0].checked = true;
};

const onModalOpen = () => {
  mainNode.style.filter = `blur(5px)`;
  footerNode.style.filter = `blur(5px)`;
  headerNode.style.filter = `blur(5px)`;
  bodyNode.style.overflow = `hidden`; // Отменяет тач-скролл страницы при перемещении вертикального слайдера в модальном окне
  modalNode.style.display = `flex`;
};

deviceCardNodes.forEach((el) => {

  el.addEventListener(`click`, (evt) => {
    const isTemperatureCard = evt.target.querySelector(`.device-card__icon use`).getAttribute(`xlink:href`).startsWith(`#icon_temperature`);

    onModalOpen();
    modalSlider.style.display = ``;
    modalContent.querySelector(`.modal__text-title`).textContent = evt.target.querySelector(`.device-card__text-title`).textContent;
    modalContent.querySelector(`.modal__text-subtitle`).textContent = evt.target.querySelector(`.device-card__text-subtitle`).textContent;
    modalContent.querySelector(`.canvas`).style.display = `none`;
    modalIcons.forEach((elm) => {
      elm.style.display = ``;
    });

    if (isTemperatureCard) {
      modalSlider.classList.add(`modal__slider--temp`);
      modalIcons[0].textContent = `+30`;
      modalIcons[0].style.top = `16px`;
      modalIcons[0].style.right = `43.5%`;

      modalIcons[1].textContent = `-10`;
      modalIcons[1].style.bottom = `0`;
      modalIcons[1].style.right = `43.5%`;
      modalIcons.forEach((element) => {
        element.style.backgroundImage = `none`;
      });
    } else {
      modalSlider.classList.add(`modal__slider--light`);
      modalRadioBtns[1].textContent = `Дневной свет`;
      modalRadioBtns[2].textContent = `Вечерний свет`;
    }
  });
});

modalRadioContainer.addEventListener(`change`, (evt) => {
  modalSlider.disabled = false;
  switch (evt.target) {
    case modalRadioInputs[0]:
      modalSlider.value = 16;
      break;
    case modalRadioInputs[1]:
      modalSlider.value = -10;
      modalSlider.disabled = true;
      break;
    case modalRadioInputs[2]:
      modalSlider.value = 30;
      modalSlider.disabled = true;
      // Мне показалось логичным, что если есть опция `вручную`, то остальные
      // кнопки должны отключать возможность редактирования инпута,
      // но это не точно
  }
});

warmFloorCard.addEventListener(`click`, () => {
  onModalOpen();
  modalContent.querySelector(`.modal__text-title`).textContent = `Xiaomi Warm Floor`;
  modalContent.querySelector(`.modal__text-subtitle`).textContent = `Включено`;
  modalContent.querySelector(`.modal__slider`).style.display = `none`;
  modalContent.querySelector(`.modal__text-radio-container`).style.visibility = `hidden`;
  // `hidden` - чтобы элемент остался на месте и верстка карточки не поехала
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
