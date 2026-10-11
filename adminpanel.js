// MockAPI manzili
const API_URL = "https://6acb832def37b1504077feb3.mockapi.io/Ovozlar";

// Ma'lumotlarni yuklash va statistikani hamda ro'yxatni yangilash
async function loadAdminData() {
    try {
        const response = await fetch(API_URL);
        const votes = await response.json();

        // 1. Har bir rasm bo'yicha ovozlar sonini hisoblash va statistika kartalariga yozish
        const counts = { 1: 0, 2: 0, 3: 0 };
        votes.forEach(vote => {
            if (counts[vote.designId] !== undefined) {
                counts[vote.designId]++;
            }
        });

        document.getElementById('admin-count-1').textContent = `${counts[1]} ovoz`;
        document.getElementById('admin-count-2').textContent = `${counts[2]} ovoz`;
        document.getElementById('admin-count-3').textContent = `${counts[3]} ovoz`;

        // 2. Ovoz berganlar ro'yxatini ekranga chiqarish
        const votersListContainer = document.getElementById('votersList');
        votersListContainer.innerHTML = '';

        if (votes.length === 0) {
            votersListContainer.innerHTML = '<p style="text-align: center; color: #777; padding: 20px;">Hozircha ovoz berganlar yo\'q.</p>';
            return;
        }

        votes.forEach(vote => {
            const item = document.createElement('div');
            item.className = 'voter-item';
            // Agar CSS faylda stillar yozilmagan bo'lsa ham chiroyli ko'rinishi uchun inline style qo'shamiz
            item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 12px 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);';

            item.innerHTML = `
                <div>
                    <strong>${vote.name || 'Ismsiz'}</strong> — <span style="color: #007bff;">${vote.phone}</span> (Dizayn #${vote.designId})
                </div>
                <button onclick="showConfirmModal('${vote.id}')" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-size: 14px;">
                    <i class="fa-solid fa-trash"></i> Nomerlarni bekor qilish
                </button>
            `;
            votersListContainer.appendChild(item);
        });

    } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
    }
}

// "Nomer o'chirilsinmi? Ha / Yo'q" oynasini chiqarish funksiyasi
function showConfirmModal(id) {
    // Agar oldindan ochilgan modal bo'lsa, uni olib tashlaymiz
    const existingModal = document.getElementById('dynamicConfirmModal');
    if (existingModal) existingModal.remove();

    // Dinamik ravishda tasdiqlash oynasini yaratamiz
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'dynamicConfirmModal';
    modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;';

    modalOverlay.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; max-width: 300px; width: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            <p style="font-size: 16px; margin-bottom: 20px; color: #333; font-weight: 500;">Nomer o'chirilsinmi?</p>
            <div style="display: flex; justify-content: center; gap: 15px;">
                <button id="confirmYes" style="background: #27ae60; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Ha</button>
                <button id="confirmNo" style="background: #e74c3c; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Yo'q</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // "Ha" tugmasi bosilganda
    document.getElementById('confirmYes').onclick = async () => {
        modalOverlay.remove();
        await deleteVoteFromAPI(id);
    };

    // "Yo'q" tugmasi bosilganda
    document.getElementById('confirmNo').onclick = () => {
        modalOverlay.remove();
    };
}

// MockAPI'dan ovozni (nomerini) o'chirish funksiyasi
async function deleteVoteFromAPI(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Ovoz muvaffaqiyatli o'chirildi! Bu raqamdan endi qayta ovoz berish mumkin.");
            loadAdminData(); // Sahifadagi statistika va ro'yxatni avtomatik yangilash (ovozlar kamayadi)
        } else {
            alert("O'chirish jarayonida xatolik yuz berdi.");
        }
    } catch (error) {
        console.error("Tarmoqda xatolik:", error);
        alert("Server bilan bog'lanishda xatolik.");
    }
}

// Sahifa to'liq yuklanganda ma'lumotlarni chiqarish
window.addEventListener('DOMContentLoaded', () => {
    loadAdminData();
});