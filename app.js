const popupOverlay = document.getElementById("popupOverlay");
const popupClose = document.getElementById("popupClose");
const leadForm = document.getElementById("leadForm");
const contactForm = document.getElementById("contactForm");
const leadMessage = document.getElementById("leadMessage");
const formMessage = document.getElementById("formMessage");

const startBonusBtn = document.getElementById("startBonusBtn");
const bonusResult = document.getElementById("bonusResult");
const bonusTrack = document.getElementById("bonusTrack");
const promoCodeInput = document.getElementById("promoCodeInput");

const MAIN_FORM_WEBHOOK = "https://n8n.auto-rost.ru/webhook-test/autorost-form";

let popupShown = false;
let bonusGenerated = false;
let selectedBonusText = "";

const bonusItems = [
  { title: "Скидка 10%", subtitle: "на первый проект", icon: "percent" },
  { title: "Скидка 15%", subtitle: "на первый проект", icon: "spark" },
  { title: "Скидка 20%", subtitle: "на первый проект", icon: "diamond" },
  { title: "Скидка 25%", subtitle: "на первый проект", icon: "bolt" },
  { title: "Бесплатный аудит", subtitle: "одного процесса", icon: "audit" }
];

const iconTemplates = {
  percent: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="21" cy="21" r="8" stroke="currentColor" stroke-width="5"/><circle cx="43" cy="43" r="8" stroke="currentColor" stroke-width="5"/><path d="M47 17L17 47" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  spark: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 6L38 25L58 32L38 39L32 58L26 39L6 32L26 25L32 6Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>`,
  diamond: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 10H46L58 26L32 56L6 26L18 10Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M6 26H58M22 10L32 56M42 10L32 56" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`,
  bolt: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M36 4L14 36H30L26 60L50 26H34L36 4Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>`,
  audit: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M28 50C40.15 50 50 40.15 50 28C50 15.85 40.15 6 28 6C15.85 6 6 15.85 6 28C6 40.15 15.85 50 28 50Z" stroke="currentColor" stroke-width="5"/><path d="M44 44L58 58" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M18 28L25 35L39 20" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

setTimeout(() => {
  if (!popupShown && popupOverlay) {
    popupOverlay.classList.add("active");
    popupShown = true;
  }
}, 25000);

if (popupClose) {
  popupClose.addEventListener("click", () => {
    popupOverlay.classList.remove("active");
  });
}

if (popupOverlay) {
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.classList.remove("active");
    }
  });
}

function createBonusCard(item) {
  const card = document.createElement("div");
  card.className = "bonus-card";
  card.innerHTML = `
    ${iconTemplates[item.icon]}
    <div class="bonus-card-title">${item.title}</div>
    <div class="bonus-card-subtitle">${item.subtitle}</div>
  `;
  return card;
}

function prepareBonusTrack() {
  if (!bonusTrack) return;

  bonusTrack.innerHTML = "";

  const repeatedItems = [];

  for (let i = 0; i < 8; i++) {
    repeatedItems.push(...bonusItems);
  }

  repeatedItems.forEach((item) => {
    bonusTrack.appendChild(createBonusCard(item));
  });

  bonusTrack.style.transition = "none";
  bonusTrack.style.transform = "translateY(0)";
}

function makePromoCode() {
  return `BONUS-${Math.floor(1000 + Math.random() * 9000)}`;
}

prepareBonusTrack();

if (startBonusBtn && bonusTrack && bonusResult) {
  startBonusBtn.addEventListener("click", () => {
    if (bonusGenerated) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    bonusGenerated = true;
    startBonusBtn.disabled = true;
    startBonusBtn.textContent = "Подбираем бонус...";
    bonusResult.textContent = "Карточки выбирают персональное предложение...";

    const cardStep = 194;
    const randomIndex = Math.floor(Math.random() * bonusItems.length);

    const finalIndex = 6 * bonusItems.length + randomIndex;
    const finalStop = -(finalIndex * cardStep);

    bonusTrack.style.transition = "none";
    bonusTrack.style.transform = "translateY(0)";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bonusTrack.style.transition = "transform 6.4s cubic-bezier(.12,.86,.18,1)";
        bonusTrack.style.transform = `translateY(${finalStop}px)`;
      });
    });

    setTimeout(() => {
      const selected = bonusItems[randomIndex];
      const promo = makePromoCode();

      selectedBonusText = selected.title;
      bonusResult.textContent = `Ваш бонус: ${selected.title}. Промокод добавлен в форму заявки.`;

      if (promoCodeInput) {
        promoCodeInput.value = promo;
        promoCodeInput.dataset.bonus = selected.title;
      }

      startBonusBtn.disabled = false;
      startBonusBtn.textContent = "Перейти к заявке";

      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 900);
    }, 6600);
  });
}

if (leadForm) {
  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);

    const payload = {
      name: formData.get("lead_name"),
      contact: formData.get("lead_contact"),
      type: "lead_magnet",
      source: "auto-rost.ru",
      created_at: new Date().toISOString()
    };

    try {
      console.log("Lead form:", payload);

      leadMessage.textContent = "Спасибо! Заявка отправлена.";
      leadForm.reset();

      setTimeout(() => {
        if (popupOverlay) {
          popupOverlay.classList.remove("active");
        }

        leadMessage.textContent = "";
      }, 1800);
    } catch (error) {
      leadMessage.textContent = "Ошибка отправки. Попробуйте еще раз.";
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formMessage.textContent = "Отправляем...";

    const formData = new FormData(contactForm);

    const payload = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      promo: formData.get("promo"),
      bonus: promoCodeInput?.dataset.bonus || selectedBonusText || "",
      task: formData.get("task"),
      type: "main_form",
      source: "auto-rost.ru",
      created_at: new Date().toISOString()
    };

    try {
      const response = await fetch(MAIN_FORM_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      formMessage.textContent = "Спасибо! Заявка отправлена.";
      contactForm.reset();

      if (promoCodeInput) {
        promoCodeInput.dataset.bonus = "";
      }
    } catch (error) {
      console.error("Main form error:", error);
      formMessage.textContent = "Ошибка отправки. Попробуйте еще раз.";
    }
  });
}
