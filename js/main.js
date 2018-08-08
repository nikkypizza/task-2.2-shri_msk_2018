'use strict';

// Не могу сообразить как сделать работающий круговой слайдер,
// но могу нарисовать его на канвасе :)
(function drawRadialTemperaturePic () {
  const canvas = document.querySelector(`canvas`);
  const ctx = canvas.getContext(`2d`);

  const colorYellow = `#F0C376`;
  const dotsPerCircle = 120;
  const interval = (Math.PI * 2) / dotsPerCircle;
  const centerX = 110.5;
  const centerY = 110.5;
  const radius = 111;
  ctx.strokeStyle = colorYellow;

  for (var i = 0; i < dotsPerCircle; i++) {
    const desiredRadianAngleOnCircle = interval * i;
    const x = centerX + radius * Math.cos(desiredRadianAngleOnCircle);
    const y = centerY + radius * Math.sin(desiredRadianAngleOnCircle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    i > 4 && i < 20 ? ctx.strokeStyle = `#000000` : ctx.strokeStyle = colorYellow;
  }
  // Тень
  ctx.strokeStyle = `white`;
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
  ctx.fillStyle = `black`;
  ctx.font = `bold 66px Arial`;
  ctx.fillText(`+23`, 54, 136);

  // Указатель
  ctx.beginPath();
  ctx.moveTo(189, 128);
  ctx.lineTo(194, 135);
  ctx.lineTo(186, 138);
  ctx.closePath();
  ctx.fill();
})();
