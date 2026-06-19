const popupOverlay = document.getElementById("popupOverlay");
const popupClose = document.getElementById("popupClose");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const startBonusBtn = document.getElementById("startBonusBtn");
const bonusResult = document.getElementById("bonusResult");
const bonusContactBtn = document.getElementById("bonusContactBtn");
const bonusTrack = document.getElementById("bonusTrack");

const MAIN_FORM_WEBHOOK = "https://n8n.auto-rost.ru/webhook-test/autorost-form";

let popupShown = false;
let bonusGenerated = false;

const bonusItems = [
  "⚡ Скидка 5%",
  "🔹 Скидка 10%",
  "💎 Скидка 15%",
  "🧩 Аудит процесса",
  "🤖 Разбор AI-идеи",
  "🚀 MVP-старт"
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

if (startBonusBtn && bonusTrack && bonusResult) {
  startBonusBtn.addEventListener("click", () => {
    if (bonusGenerated) return;

    bonusGenerated = true;
    startBonusBtn.disabled = true;
    startBonusBtn.textContent = "Подбираем...";
    bonusResult.textContent = "AI подбирает бонус под ваш первый проект...";

    const randomIndex = Math.floor(Math.random() * bonusItems.length);
    const cardHeight = 96;

    bonusTrack.innerHTML = "";

    const repeatedItems = [];

    for (let i = 0; i < 5; i++) {
      repeatedItems.push(...bonusItems);
    }

    repeatedItems.push(bonusItems[randomIndex]);

    repeatedItems.forEach((item) => {
      const card = document.createElement("div");
      card.className = "bonus-card";
      card.textContent = item;
      bonusTrack.appendChild(card);
    });

    const stopPosition = -((repeatedItems.length - 1) * cardHeight);

    bonusTrack.style.setProperty("--stop-position", `${stopPosition}px`);
    bonusTrack.classList.remove("spin");

    void bonusTrack.offsetWidth;

    bonusTrack.classList.add("spin");

    setTimeout(() => {
      bonusResult.textContent = `Ваш бонус: ${bonusItems[randomIndex]}`;
      startBonusBtn.textContent = "Бонус выбран";

      if (bonusContactBtn) {
        bonusContactBtn.classList.add("active");
      }
    }, 2900);
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
