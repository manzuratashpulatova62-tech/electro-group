document.addEventListener('DOMContentLoaded', function() {
    // 1. Elementlarni HTML ichidan aniq ushlab olamiz
    const idInput = document.querySelector('.menu2 input[type="text"]');
    const kodInput = document.querySelector('.menu2 input[type="number"]');
    const kirishBtn = document.querySelector('.kirish-text');
    const menuBox = document.querySelector('.menu2');

    // 2. Xatolik xabarini chiqaradigan element yaratib olamiz
    const xatoMatn = document.createElement('p');
    xatoMatn.style.color = '#ef4444';
    xatoMatn.style.fontSize = '14px';
    xatoMatn.style.marginTop = '12px';
    xatoMatn.style.textAlign = 'center';
    xatoMatn.style.fontWeight = '600';
    xatoMatn.style.display = 'none'; // Boshida yashirin turadi
    if (menuBox) {
        menuBox.appendChild(xatoMatn);
    }

    // 3. Tugma bosilganda ishlaydigan funksiya (Login)
    if (kirishBtn) {
        kirishBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Sahifa qayta yuklanib ketishini oldini oladi

            const idQiymat = idInput ? idInput.value.trim() : '';
            const kodQiymat = kodInput ? kodInput.value.trim() : '';

            // Harflardan iboratligini tekshirish (faqat a-z, A-Z harflar)
            const faqatHarf = /^[a-zA-Z]+$/.test(idQiymat);

            // Maydonlar bo'sh bo'lsa
            if (idQiymat === '' || kodQiymat === '') {
                xatoMatn.textContent = "Iltimos, barcha maydonlarni to'ldiring!";
                xatoMatn.style.display = 'block';
                return;
            }

            // Tekshirish shartlari: ID = "Aziz", Kod = "1"
            if (faqatHarf && idQiymat === "Aziz" && kodQiymat === "1") {
                xatoMatn.style.display = 'none';
                // To'g'ri bo'lsa yangi sahifaga yo'naltiradi
                window.location.href = './adminpnel.html';
            } else {
                // Noto'g'ri bo'lsa qizil yozuv chiqadi
                xatoMatn.textContent = "ID yoki kod noto'g'ri!";
                xatoMatn.style.display = 'block';
            }
        });
    }

    // 4. Orqaga qaytish tugmasini yaratish va qo'shish
    if (menuBox) {
        const orqagaBtn = document.createElement('button');
        orqagaBtn.textContent = "← Orqaga qaytish";
        orqagaBtn.style.marginTop = '12px';
        orqagaBtn.style.width = '100%';
        orqagaBtn.style.padding = '10px';
        orqagaBtn.style.background = 'transparent';
        orqagaBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        orqagaBtn.style.borderRadius = '10px';
        orqagaBtn.style.color = '#94a3b8';
        orqagaBtn.style.fontSize = '14px';
        orqagaBtn.style.fontWeight = '600';
        orqagaBtn.style.cursor = 'pointer';
        orqagaBtn.style.transition = '0.3s';

        // Sichqoncha ustiga kelgandagi effekt
        orqagaBtn.addEventListener('mouseenter', function() {
            orqagaBtn.style.borderColor = '#f59e0b';
            orqagaBtn.style.color = '#ffffff';
        });
        orqagaBtn.addEventListener('mouseleave', function() {
            orqagaBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            orqagaBtn.style.color = '#94a3b8';
        });

        // Orqaga bosilganda bosh sahifaga o'tish
        orqagaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = './index.html'; // Bosh sahifa manzili
        });

        menuBox.appendChild(orqagaBtn);
    }
});

// ==========================================
// BARCHA QURILMALARDAN OVOZLARNI O'CHIRISH FUNKSIYASI
// ==========================================
// Admin paneldagi "Ovozlarni o'chirish" tugmasiga onclick="resetAllVotes()" qilib bog'laysiz
function resetAllVotes() {
    if (!confirm("Haqiqatan ham barcha qurilmalardagi ovozlarni o'chirib tashlamoqchimisiz?")) {
        return;
    }

    // 1. To'liq nolga tushirilgan ma'lumotlar strukturasi
    const emptyData = {
        votes: { 1: 0, 2: 0, 3: 0 },
        voters: {}
    };

    // 2. Lokal xotirani (localStorage) tozalash
    localStorage.setItem("asar_votes_data", JSON.stringify(emptyData));

    // 3. SERVERDAN (Firebase) to'liq o'chirish
    if (window.db) {
        // .set() orqali butun tugunni yangilaymiz va darhol tarqatamiz
        window.db.ref("asar_votes_data").set(emptyData)
            .then(() => {
                // iPhone va boshqa brauzerlarda keshlarni tozalash va majburiy UI yangilash
                if (typeof updateUI === "function") {
                    updateUI();
                }
                alert("Barcha ovozlar serverdan va barcha qurilmalardan (iPhone, Android, PC) muvaffaqiyatli o'chirildi!");
            })
            .catch((error) => {
                console.error("Firebase o'chirish xatoligi:", error);
                alert("Serverdan o'chirishda xatolik yuz berdi: " + error.message);
            });
    } else {
        alert("Xatoliк: Firebase bazasi (window.db) ushbu sahifada topilmadi! Admin sahifasiga Firebase scriptlarini ulaganingizni tekshiring.");
    }
}