const popupOverlay = document.getElementById("popupOverlay");
const popupClose = document.getElementById("popupClose");
const leadForm = document.getElementById("leadForm");
const contactForm = document.getElementById("contactForm");
const leadMessage = document.getElementById("leadMessage");
const formMessage = document.getElementById("formMessage");

const MAIN_FORM_WEBHOOK = "https://n8n.auto-rost.ru/webhook-test/autorost-form";

let popupShown = false;

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
