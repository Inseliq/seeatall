// ===== animation.js =====

// Обновление позиции бейджа
function updateBadgePosition(badge, percent) {
  const clamped = Math.max(4, Math.min(96, percent));
  badge.style.setProperty('--pos', clamped + '%');
  badge.style.left = `calc(${clamped}% + 12px)`;
  if (!badge.classList.contains('visible')) badge.classList.add('visible');
}

// Анимация прогресс-бара
function animateProgressBar(startVal, total, endVal, marathonFill, currentValEl, bubble, percentEl, badge, celebrateBox) {
  animateValue(startVal, total, 1400, function (val) {
    const rounded = Math.round(val);
    currentValEl.textContent = formatNumber(rounded);
    bubble.textContent = formatNumber(rounded);
    const percent = endVal > 0 ? clamp((val / endVal) * 100, 0, 100) : 0;
    marathonFill.style.width = percent + '%';
    marathonFill.setAttribute('aria-valuenow', String(rounded));
    percentEl.textContent = Math.round(percent) + '%';
    updateBadgePosition(badge, percent);
  }, function onComplete() {
    if (total >= endVal) {
      celebrateBox.classList.add('show');
      setTimeout(() => celebrateBox.classList.remove('show'), 5000);
      marathonFill.style.boxShadow = '0 0 30px rgba(157,124,255,0.28), inset 0 0 20px rgba(124,255,203,0.08)';
    } else if ((total / endVal) >= 0.8) {
      marathonFill.style.boxShadow = 'inset 0 0 32px rgba(124,255,203,0.08)';
    }
  });
}