// MockAPI manzili
const API_URL = "https://6acb832def37b1504077feb3.mockapi.io/Ovozlar";

// Joriy tanlangan dizayn ID sini saqlash uchun
let currentDesignId = null;

// Modal oynani ochish
function openVoteModal(designId) {
    currentDesignId = designId;
    document.getElementById('selectedDesignId').value = designId;
    document.getElementById('voteModal').style.display = 'flex';
}

// Modal oynani yopish
function closeVoteModal() {
    document.getElementById('voteModal').style.display = 'none';
    document.getElementById('voteForm').reset();
}

// Mobil menyu uchun (agar index.js da yozilmagan bo'lsa)
document.getElementById('mobileToggle')?.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// Ovoz berish formasini yuborish
async function submitVote(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value.trim();
    let phone = document.getElementById('userPhone').value.trim();

    // 1. Telefon raqamining haqiqiyligini tekshirish (+998 bilan boshlanishi va 9 ta raqam bo'lishi shart)
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("Iltimos, telefon raqamini to'g'ri kiriting! Masalan: +998901234567");
        return;
    }

    try {
        // 2. MockAPI dan barcha mavjud ovozlarni olib kelib, bu raqam oldin ovoz berganmi tekshiramiz
        const response = await fetch(API_URL);
        const votes = await response.json();

        const alreadyVoted = votes.some(vote => vote.phone === phone);
        if (alreadyVoted) {
            alert("Bu telefon raqamidan allaqachon ovoz berilgan! Har bir raqamdan faqat bir marta ovoz berish mumkin.");
            return;
        }

        // 3. Yangi ovozni MockAPI ga yuborish
        const newVote = {
            name: name,
            phone: phone,
            designId: Number(currentDesignId),
            createdAt: new Date().toISOString()
        };

        const postResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVote)
        });

        if (postResponse.ok) {
            alert("Ovozongiz muvaffaqiyatli qabul qilindi! Rahmat.");
            closeVoteModal();
            loadVotesAndUpdateUI(); // Interfeysni yangilash
        } else {
            alert("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
        }

    } catch (error) {
        console.error("Tarmoqda xatolik:", error);
        alert("Server bilan bog'lanishda xatolik yuz berdi.");
    }
}

// 4. MockAPI dan ma'lumotlarni olib kelib, foizlar va progress barlarni yangilash
async function loadVotesAndUpdateUI() {
    try {
        const response = await fetch(API_URL);
        const votes = await response.json();

        // Jami ovozlar soni
        const totalVotes = votes.length;

        // Har bir dizayn uchun ovozlar sonini sanash (1, 2, 3)
        const counts = { 1: 0, 2: 0, 3: 0 };
        votes.forEach(vote => {
            if (counts[vote.designId] !== undefined) {
                counts[vote.designId]++;
            }
        });

        // Har bir card uchun progress bar va foizlarni hisoblab chiqarish
        [1, 2, 3].forEach(id => {
            const count = counts[id];
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            const bar = document.getElementById(`bar-${id}`);
            const percentSpan = document.getElementById(`percent-${id}`);

            if (bar) bar.style.width = `${percentage}%`;
            if (percentSpan) percentSpan.textContent = `${percentage}% (${count} ovoz)`;
        });

    } catch (error) {
        console.error("Ovozlarni yuklashda xatolik:", error);
    }
}

// Sahifa yuklanganda mavjud ovozlarni chiqarish
window.addEventListener('DOMContentLoaded', () => {
    loadVotesAndUpdateUI();
});