/* ============================================================
   BHF — Contact form (no backend: composes a WhatsApp message)
   ============================================================ */

(function () {
  var form = document.querySelector("[data-contact-form]");
  var status = document.querySelector("[data-form-status]");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = new FormData(form);
    var lines = [
      "Hello BHF, my name is " + data.get("name") + ".",
      "Regarding: " + data.get("subject"),
      "",
      data.get("message"),
      "",
      "Contact: " + data.get("email") + (data.get("phone") ? " / " + data.get("phone") : "")
    ];

    var url = "https://wa.me/6281227160160?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");

    if (status) {
      status.textContent =
        "Thank you, " + data.get("name") + ". Your message is opening in WhatsApp — " +
        "our team usually replies within one working day.";
      status.classList.add("is-visible");
    }

    form.reset();
  });
})();
