// ===== on.load.js =====
document.addEventListener('DOMContentLoaded', function () {

  const pb = document.querySelector('.progress-bar'); // для совместимости
  const marathonFill = document.getElementById('marathonFill');
  const currentValEl = document.getElementById('currentVal');
  const goalValEl = document.getElementById('goalVal');
  const percentEl = document.getElementById('percentVal');
  const bubble = document.getElementById('bubbleValue');
  const badge = document.getElementById('fillBadge');
  const celebrateBox = document.getElementById('celebrate');
  const startLabel = document.getElementById('start-val-label');

  let endVal = 25000, startVal = 0;
  if (pb) {
    endVal = parseInt(pb.getAttribute('data-end-progress')) || endVal;
    startVal = parseInt(pb.getAttribute('data-start-progress')) || startVal;
  }

  // ===== Подсчёты
  const daySums = calculateDaySums();
  const monthSums = calculateMonthSums();
  const total = calculateTotal(startVal);
  if (pb) pb.setAttribute('data-sum-progress', String(total));

  // Подписи
  currentValEl.textContent = formatNumber(startVal);
  goalValEl.textContent = formatNumber(endVal);
  startLabel.textContent = formatNumber(startVal);

  const startPercent = endVal > 0 ? clamp((startVal / endVal) * 100, 0, 100) : 0;
  marathonFill.style.width = startPercent + '%';
  marathonFill.setAttribute('aria-valuenow', String(startVal));
  percentEl.textContent = Math.round(startPercent) + '%';
  updateBadgePosition(badge, startPercent);

  // Запуск анимации прогресса
  animateProgressBar(startVal, total, endVal, marathonFill, currentValEl, bubble, percentEl, badge, celebrateBox);

  // ================= Модальное .list-law =================
  const btn = document.querySelector('.list-btn');
  const law = document.querySelector('.list-law');
  const modalClose = law ? law.querySelector('.modal-close') : null;

  if (btn && law) {
    let autoCloseTimer = null;
    let visible = false;

    function openModal() {
      visible = true;
      law.classList.add('marathon-visible');
      law.setAttribute('aria-hidden', 'false');
      document.body.classList.add('marathon-modal-open');
      clearTimeout(autoCloseTimer);
      autoCloseTimer = setTimeout(closeModal, 10000);
    }
    function closeModal() {
      visible = false;
      law.classList.remove('marathon-visible');
      law.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('marathon-modal-open');
      clearTimeout(autoCloseTimer);
    }

    btn.addEventListener('click', e => { e.stopPropagation(); visible ? closeModal() : openModal(); });
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    law.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', () => { if (visible) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && visible) closeModal(); });
    if (modalClose) modalClose.addEventListener('click', closeModal);
  }

  // ================= Кнопки "Смотреть стрим" / "Поддержать" =================
  const donateBtn = document.getElementById('donateBtn');
  const streamBtn = document.getElementById('streamBtn');

  if (donateBtn) donateBtn.addEventListener('click', function () {
    this.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 380 });
  });

  if (streamBtn) streamBtn.addEventListener('click', function () {
    this.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 240 });
  });

});