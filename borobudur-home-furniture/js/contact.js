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
      "Halo BHF, saya " + data.get("name") + ".",
      "Kebutuhan: " + data.get("subject"),
      "",
      data.get("message"),
      "",
      "Kontak: " + data.get("email") + (data.get("phone") ? " / " + data.get("phone") : "")
    ];

    var url = "https://wa.me/6281227160160?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");

    if (status) {
      status.textContent =
        "Terima kasih, " + data.get("name") + ". Pesan Anda sedang dibuka di WhatsApp — " +
        "tim kami biasanya membalas dalam satu hari kerja.";
      status.classList.add("is-visible");
    }

    form.reset();
  });
})();
