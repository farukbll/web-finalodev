function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
    videoKapat();
  }
});

function toggleAccordion(id) {
  const content = document.getElementById(id);
  if (!content) return;
  content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
}

function videoAc(videoSrc) {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('modalVideo');
  if (!modal || !video) return;
  video.querySelector('source').src = videoSrc;
  video.load();
  modal.style.display = 'flex';
  video.play();
}

function videoKapat() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('modalVideo');
  if (!modal || !video) return;
  video.pause();
  video.currentTime = 0;
  modal.style.display = 'none';
}

function havaDurumuGetir() {
  const kutu = document.getElementById('hava-bilgi-kutusu');
  if (!kutu) return;
  kutu.innerHTML = "<p>Yükleniyor...</p>";

  fetch('https://wttr.in/Kyoto?format=j1')
    .then(res => res.json())
    .then(data => {
      const current = data.current_condition[0];
      const derece = current.temp_C;
      const durum = current.weatherDesc[0].value;
      const isDay = current.isdaytime || !current.weatherIconUrl[0].value.includes("night");
      const tarih = new Date().toLocaleDateString('tr-TR');

      kutu.innerHTML = `
        <h3>Kyoto, Japonya</h3>
        <p>📅 Tarih: ${tarih}</p>
        <p>🌡️ Sıcaklık: ${derece}°C</p>
        <p>⛅ Hava Durumu: ${durum}</p>
      `;
      kutu.classList.toggle('gece', !isDay);
    })
    .catch(() => {
      kutu.innerHTML = "<p>Hava durumu bilgisi alınamadı.</p>";
    });
}

window.addEventListener('DOMContentLoaded', havaDurumuGetir);

document.getElementById("destek-form")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const isim = this.isim.value;
  const email = this.email.value;
  const telefon = this.telefon.value;
  const tarih = this.date.value;
  const mesaj = this.message.value;
  const yeniGeriBildirim = { isim, email, telefon, tarih, mesaj };
  const geriBildirimler = JSON.parse(localStorage.getItem("kyotoGeriBildirimler") || "[]");
  geriBildirimler.push(yeniGeriBildirim);
  localStorage.setItem("kyotoGeriBildirimler", JSON.stringify(geriBildirimler));
  alert("Geri bildiriminiz başarıyla kaydedildi!");
  this.reset();
  gosterGeriBildirimler();
});

function gosterGeriBildirimler() {
  const listeDiv = document.getElementById("geriBildirimListesi");
  if (!listeDiv) return;
  const geriBildirimler = JSON.parse(localStorage.getItem("kyotoGeriBildirimler") || "[]");
  if (geriBildirimler.length === 0) {
    listeDiv.innerHTML = "<p>Henüz geri bildirim yok.</p>";
    return;
  }
  let html = "<ul>";
  for (let i = geriBildirimler.length - 1; i >= 0; i--) {
    const gb = geriBildirimler[i];
    html += `
      <li>
        <strong>${gb.isim}</strong> - <em>${gb.tarih}</em>
        <p>${gb.mesaj}</p>
      </li>
    `;
  }
  html += "</ul>";
  listeDiv.innerHTML = html;
}

window.addEventListener("DOMContentLoaded", () => {
  gosterGeriBildirimler();
  document.getElementById("bildirimTemizle")?.addEventListener("click", () => {
    localStorage.removeItem("kyotoGeriBildirimler");
    gosterGeriBildirimler();
    alert("Tüm geri bildirimler temizlendi.");
  });
});
