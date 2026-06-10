/* =========================================================
   WareHouse Ambar Sistemi — Vizual İş Prinsipi
   script.js  ·  Bütün interaktivlik saf JavaScript ilə
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* =======================================================
     1) SMOOTH SCROLL NAVİQASİYA + mobil menyunu bağlamaq
     CSS-də scroll-behavior:smooth var; burada sticky nav
     hündürlüyünə görə bir az offset veririk və mobil
     menyunu klikdən sonra bağlayırıq.
  ======================================================= */
  const navLinks = document.getElementById('navList');
  const navHeight = 62; // sticky nav hündürlüyü (px)

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Mobil menyu açıqdırsa bağla
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* =======================================================
     9) MOBİL MENYU TOGGLE (hamburger)
  ======================================================= */
  const navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  /* =======================================================
     10) YUXARI SCROLL PROGRESS BAR
     Səhifənin nə qədər oxunduğunu göstərir.
  ======================================================= */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* =======================================================
     11) BACK TO TOP düyməsi
  ======================================================= */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =======================================================
     12) AKTİV BÖLMƏ İŞARƏLƏNMƏSİ (active nav link)
     IntersectionObserver ilə hansı bölmənin ekranda
     olduğunu tapıb uyğun nav linkini vurğulayırıq.
  ======================================================= */
  const navAnchors = Array.from(navLinks.querySelectorAll('a'));
  const watchedSections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  watchedSections.forEach(s => sectionObserver.observe(s));

  // Scroll hadisəsi: progress bar + back-to-top görünüşü
  window.addEventListener('scroll', function () {
    updateProgress();
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  updateProgress();

  /* =======================================================
     2) STEPPER / TIMELINE — başlanğıc addımları
     Sol tərəfdə addımlar, klikləyəndə sağda ətraflı izah.
  ======================================================= */
  const stepsData = [
    { t: 'Şirkət məlumatları qurulur',
      d: 'İlk olaraq şirkətin adı, valyutası və əlaqə məlumatları daxil edilir. Bu, bütün sənədlərin və hesabatların əsasını təşkil edir.' },
    { t: 'Anbarlar yaradılır',
      d: 'Anbar yaratmadan sistem malların harada saxlandığını bilməz. Eyni məhsul bir neçə anbarda ayrı-ayrı miqdarda ola bilər.' },
    { t: 'Ölçü vahidləri yaradılır',
      d: 'Malların necə sayıldığını müəyyən edir: ədəd, kiloqram, litr və s. Hər məhsula bir ölçü vahidi təyin olunur.' },
    { t: 'Məhsul qrupları yaradılır',
      d: 'Məhsullar kateqoriyalara bölünür (məsələn: Elektronika, Mebel). Bu, axtarışı və hesabatları asanlaşdırır.' },
    { t: 'Məhsullar yaradılır',
      d: 'Hər mal sistemə əlavə olunur: adı, qrupu, ölçü vahidi və qiyməti ilə. Diqqət: məhsul yaratmaq hələ stok yaratmır.' },
    { t: 'Təchizatçılar yaradılır',
      d: 'Bizə mal satan şirkətlər qeyd olunur. Alış prosesi məhz təchizatçı seçilməsi ilə başlayır.' },
    { t: 'Müştərilər yaradılır',
      d: 'Bizdən mal alan tərəflər qeyd olunur. Satış prosesi müştəri seçilməsi ilə başlayır.' },
    { t: 'Alış və satış prosesləri başlayır',
      d: 'Artıq mal qəbul edilə (stok artır) və satıla (stok azalır) bilər. Sistem hər hərəkəti qeyd edir.' },
    { t: 'Stok hesabatı izlənir',
      d: 'İstənilən anda hansı məhsuldan hansı anbarda nə qədər qaldığı hesabatlarda görünür. Sistem bunu əməliyyatların cəmindən hesablayır.' }
  ];

  const stepsList = document.getElementById('steps');
  const stepDetail = document.getElementById('stepDetail');

  // Addımları render et
  stepsData.forEach(function (step, i) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'step-btn';
    btn.setAttribute('role', 'tab');
    btn.innerHTML = '<span class="step-num">' + (i + 1) + '</span>' +
                    '<span class="step-label">' + step.t + '</span>';
    btn.addEventListener('click', function () { selectStep(i); });
    li.appendChild(btn);
    stepsList.appendChild(li);
  });

  function selectStep(index) {
    const buttons = stepsList.querySelectorAll('.step-btn');
    buttons.forEach((b, i) => b.classList.toggle('active', i === index));
    const s = stepsData[index];
    stepDetail.innerHTML =
      '<span class="step-tag">Addım ' + (index + 1) + '</span>' +
      '<h3>' + s.t + '</h3>' +
      '<p>' + s.d + '</p>';
  }
  selectStep(0); // ilk addım açıq başlasın

  /* =======================================================
     3) PROSES KARTLARININ AÇILIB-BAĞLANMASI (alış/satış flow)
  ======================================================= */
  document.querySelectorAll('.flow-card .fc-head').forEach(function (head) {
    head.addEventListener('click', function () {
      const card = head.closest('.flow-card');
      card.classList.toggle('is-open');
    });
  });

  /* =======================================================
     4) STOK SAYĞACI ANİMASİYASI (stok necə yaranır)
     Rəqəm cari dəyərdən hədəf dəyərə yumşaq keçir.
  ======================================================= */
  const counterValue = document.getElementById('counterValue');
  let counterCurrent = 0;

  function animateNumber(el, from, to, isUp) {
    const duration = 450;
    const start = performance.now();
    el.classList.remove('pulse-up', 'pulse-down');
    void el.offsetWidth; // reflow — animasiyanı yenidən işə salır
    el.classList.add(isUp ? 'pulse-up' : 'pulse-down');

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = to;
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll('[data-counter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const delta = parseInt(btn.getAttribute('data-counter'), 10);
      const next = counterCurrent + delta;
      animateNumber(counterValue, counterCurrent, next, delta > 0);
      counterCurrent = next;
    });
  });
  document.getElementById('counterReset').addEventListener('click', function () {
    animateNumber(counterValue, counterCurrent, 0, false);
    counterCurrent = 0;
  });

  /* =======================================================
     5) TRANSFER KALKULYATORU
     Mənbə → hədəf. Stok çatmırsa xəbərdarlıq.
  ======================================================= */
  const trFrom = document.getElementById('trFrom');
  const trTo = document.getElementById('trTo');
  const trAmount = document.getElementById('trAmount');
  const trFromStock = document.getElementById('trFromStock');
  const trToStock = document.getElementById('trToStock');
  const trWarning = document.getElementById('trWarning');

  // Başlanğıc dəyərləri kartlara yansıt
  function syncTransferDisplay() {
    trFromStock.textContent = trFrom.value || 0;
    trToStock.textContent = trTo.value || 0;
  }
  [trFrom, trTo].forEach(inp => inp.addEventListener('input', function () {
    syncTransferDisplay();
    trWarning.classList.remove('show');
  }));

  document.getElementById('trRun').addEventListener('click', function () {
    const from = parseInt(trFrom.value, 10) || 0;
    const to = parseInt(trTo.value, 10) || 0;
    const amount = parseInt(trAmount.value, 10) || 0;

    if (amount > from) {
      trWarning.classList.add('show');
      return;
    }
    trWarning.classList.remove('show');

    const newFrom = from - amount;
    const newTo = to + amount;

    animateNumber(trFromStock, from, newFrom, false);
    animateNumber(trToStock, to, newTo, true);

    // Inputları yeni dəyərlərlə yenilə (ardıcıl transferlər üçün)
    trFrom.value = newFrom;
    trTo.value = newTo;
  });
  syncTransferDisplay();

  /* =======================================================
     6) STOK SAYIMI KALKULYATORU
     Fərq = fiziki − sistem. İşarəyə görə rəng dəyişir.
  ======================================================= */
  const scResult = document.getElementById('scResult');
  document.getElementById('scRun').addEventListener('click', function () {
    const sys = parseInt(document.getElementById('scSys').value, 10) || 0;
    const count = parseInt(document.getElementById('scCount').value, 10) || 0;
    const delta = count - sys;

    scResult.classList.remove('in', 'out', 'neutral');

    if (delta > 0) {
      scResult.classList.add('in');
      scResult.innerHTML = '<span class="big">Fərq: +' + delta + '</span>' +
        'Fiziki mal sistemdəkindən çoxdur — stok ' + delta + ' ədəd <strong>artmalıdır</strong>.';
    } else if (delta < 0) {
      scResult.classList.add('out');
      scResult.innerHTML = '<span class="big">Fərq: ' + delta + '</span>' +
        'Fiziki mal sistemdəkindən azdır — stok ' + Math.abs(delta) + ' ədəd <strong>azalmalıdır</strong>.';
    } else {
      scResult.classList.add('neutral');
      scResult.innerHTML = '<span class="big">Fərq: 0</span>' +
        'Fiziki mal sistemlə eynidir — <strong>dəyişiklik yoxdur</strong>.';
    }
  });

  /* =======================================================
     7) ƏSAS STOK SİMULYATORU + 8) TARİXÇƏ RENDERİ
  ======================================================= */
  const simStock = document.getElementById('simStock');
  const simWarning = document.getElementById('simWarning');
  const historyList = document.getElementById('historyList');
  let simCurrent = 0;
  let historyEmpty = true;

  function renderHistoryRow(opName, amount, prev, next) {
    // Boş mesajı sil
    if (historyEmpty) {
      historyList.innerHTML = '';
      historyEmpty = false;
    }
    const isIn = amount > 0;
    const li = document.createElement('li');
    li.className = 'h-row ' + (isIn ? 'is-in' : 'is-out');
    li.innerHTML =
      '<span class="h-name"><span class="h-tag">' + (isIn ? 'GİRİŞ' : 'ÇIXIŞ') + '</span>' + opName + '</span>' +
      '<span class="h-change">' + (isIn ? '+' : '') + amount + '</span>' +
      '<span class="h-flow">' + prev + ' → ' + next + '</span>';
    historyList.insertBefore(li, historyList.firstChild); // ən yeni yuxarıda
  }

  document.querySelectorAll('[data-op]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const amount = parseInt(btn.getAttribute('data-amount'), 10);
      const opName = btn.getAttribute('data-op');
      const prev = simCurrent;
      const next = prev + amount;

      animateNumber(simStock, prev, next, amount > 0);
      simCurrent = next;

      // Mənfi stok xəbərdarlığı
      simStock.classList.toggle('warn', next < 0);
      simWarning.classList.toggle('show', next < 0);

      renderHistoryRow(opName, amount, prev, next);
    });
  });

  document.getElementById('simReset').addEventListener('click', function () {
    animateNumber(simStock, simCurrent, 0, false);
    simCurrent = 0;
    simStock.classList.remove('warn');
    simWarning.classList.remove('show');
    historyList.innerHTML = '<li class="history-empty">Hələ əməliyyat yoxdur. Soldakı düymələrdən birinə basın.</li>';
    historyEmpty = true;
  });

  /* =======================================================
     İŞ MƏNTİQİ KARTLARININ TOOLTIP-i (hover izahı)
     data-tip mətnini tooltip qutusuna yazıb göstəririk.
  ======================================================= */
  document.querySelectorAll('.op-chip').forEach(function (chip) {
    const tip = chip.querySelector('.tooltip');
    if (tip) tip.textContent = chip.getAttribute('data-tip') || '';
    chip.addEventListener('mouseenter', () => chip.classList.add('show-tip'));
    chip.addEventListener('mouseleave', () => chip.classList.remove('show-tip'));
    // Toxunmatik ekranlar üçün: klikləyəndə də açılsın
    chip.addEventListener('click', () => chip.classList.toggle('show-tip'));
  });

});
