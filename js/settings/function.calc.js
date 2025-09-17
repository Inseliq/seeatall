// ===== function.calc.js =====

// Парсинг числа из атрибута
function parseNumberFromAttr(raw) {
  if (raw == null) return 0;
  const cleaned = String(raw).replace(/[^\d-]+/g, '');
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? 0 : n;
}

// Формат числа для отображения
function formatNumber(n) {
  try { return Number(n).toLocaleString('ru-RU'); } catch { return String(n); }
}

// Ограничение значения между a и b
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

// Анимация числового значения
function animateValue(from, to, duration, onUpdate, onComplete) {
  const start = performance.now();
  const diff = to - from;
  if (duration <= 0) {
    onUpdate(to); if (onComplete) onComplete(); return;
  }
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    const current = from + diff * eased;
    onUpdate(current);
    if (t < 1) requestAnimationFrame(frame); else if (onComplete) onComplete();
  }
  requestAnimationFrame(frame);
}

// Функция сглаживания анимации
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// ================= Суммы по дням и месяцам =================
function calculateDaySums() {
  const dayLists = Array.from(document.querySelectorAll('.list-day'));
  const daySums = [];
  dayLists.forEach(list => {
    const dayHeader = list.querySelector('h3[data-day]') || list.querySelector('h3');
    const liPlus = Array.from(list.querySelectorAll('li[data-plus]'));
    let sum = 0;
    liPlus.forEach(li => sum += parseNumberFromAttr(li.getAttribute('data-plus')));

    if (dayHeader) dayHeader.setAttribute('data-day-sum', String(sum));
    else list.setAttribute('data-day-sum', String(sum));

    list.setAttribute('data-plus-sum', String(sum));
    daySums.push(sum);
  });
  return daySums;
}

function calculateMonthSums() {
  const months = Array.from(document.querySelectorAll('.month'));
  const monthSums = [];
  months.forEach(monthEl => {
    const listsInMonth = Array.from(monthEl.querySelectorAll('.list-day'));
    let monthSum = 0;
    listsInMonth.forEach(list => {
      const header = list.querySelector('h3[data-day-sum]') || list.querySelector('h3');
      if (header && header.getAttribute && header.getAttribute('data-day-sum') != null) {
        monthSum += parseNumberFromAttr(header.getAttribute('data-day-sum'));
      } else if (list.getAttribute('data-day-sum') != null) {
        monthSum += parseNumberFromAttr(list.getAttribute('data-day-sum'));
      } else {
        const liPlus = Array.from(list.querySelectorAll('li[data-plus]'));
        liPlus.forEach(li => { monthSum += parseNumberFromAttr(li.getAttribute('data-plus')); });
      }
    });

    const spanMonth = monthEl.querySelector('[data-month-sum]');
    if (spanMonth) spanMonth.setAttribute('data-month-sum', String(monthSum));
    else monthEl.setAttribute('data-month-sum', String(monthSum));

    monthSums.push(monthSum);
  });
  return monthSums;
}

function calculateTotal(startVal) {
  const allLiPlus = Array.from(document.querySelectorAll('li[data-plus]'));
  let plusSum = 0;
  if (allLiPlus.length > 0) {
    allLiPlus.forEach(li => { plusSum += parseNumberFromAttr(li.getAttribute('data-plus')); });
  } else {
    const daySums = calculateDaySums();
    plusSum = daySums.reduce((a, b) => a + b, 0);
  }
  return startVal + plusSum;
}