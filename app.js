const popupOverlay = document.getElementById("popupOverlay");
const popupClose = document.getElementById("popupClose");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const startBonusBtn = document.getElementById("startBonusBtn");
const bonusStatus = document.getElementById("bonusStatus");
const bonusProgressFill = document.getElementById("bonusProgressFill");
const bonusResult = document.getElementById("bonusResult");
const bonusContactBtn = document.getElementById("bonusContactBtn");

const MAIN_FORM_WEBHOOK = "https://n8n.auto-rost.ru/webhook-test/autorost-form";

let popupShown = false;
let bonusGenerated = false;

const bonuses = [
  "🎁 Скидка 5% на первый проект",
  "🎁 Скидка 10% на первый проект",
  "🎁 Скидка 15% на первый проект",
  "🎁 Бесплатный мини-аудит процесса",
  "🎁 Разбор идеи сайта или AI-инструмента"
];

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

if (startBonusBtn) {
  startBonusBtn.addEventListener("click", () => {
    if (bonusGenerated) return;

    bonusGenerated = true;
    startBonusBtn.disabled = true;
    startBonusBtn.textContent = "Генерируем...";
    bonusResult.textContent = "AI подбирает ваш бонус...";
    bonusStatus.textContent = "Анализируем доступные предложения";
    bonusProgressFill.style.width = "0%";

    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 8;

      if (progress >= 100) {
        progress = 100;
      }

      bonusProgressFill.style.width = `${progress}%`;

      if (progress < 35) {
        bonusStatus.textContent = "Проверяем направление проекта...";
      } else if (progress < 70) {
        bonusStatus.textContent = "Подбираем подходящий бонус...";
      } else {
        bonusStatus.textContent = "Финализируем предложение...";
      }

      if (progress >= 100) {
        clearInterval(interval);

        const randomBonus = bonuses[Math.floor(Math.random() * bonuses.length)];

        setTimeout(() => {
          bonusStatus.textContent = "Бонус готов";
          bonusResult.textContent = randomBonus;
          startBonusBtn.textContent = "Бонус получен";
          bonusContactBtn.classList.add("active");
        }, 500);
      }
    }, 350);
  });
}

if (bonusContactBtn) {
  bonusContactBtn.addEventListener("click", () => {
    if (popupOverlay) {
      popupOverlay.classList.remove("active");
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
    } catch (error) {
      console.error("Main form error:", error);
      formMessage.textContent = "Ошибка отправки. Попробуйте еще раз.";
    }
  });
}
