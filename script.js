document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('greetingForm');
    const greetingCard = document.getElementById('greetingCard');
    const cardContent = document.getElementById('cardContent');
    const recipientName = document.getElementById('recipientName');
    const greetingMessage = document.getElementById('greetingMessage');
    const downloadBtn = document.getElementById('downloadBtn');

    const backgroundStyles = ['bg-style-1', 'bg-style-2', 'bg-style-3', 'bg-style-4', 'bg-style-5'];

    async function generateGreeting(name) {
        const API_KEY = 'AIzaSyCK6Fz3V2D0wIZBbrIDI2RkqtDLDyLexeQ'; // Thay bằng API key thực của bạn
        // Dùng gemini-1.5-flash vì gemini-2.0-flash chưa tồn tại. Thay đổi nếu model 2.0 có thật sau này
        const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

        const prompt = `Với vai trò là một nhà thơ tài năng và đầy cảm xúc, hãy sáng tác một lời chúc mừng ngày 8/3 đặc biệt dành cho ${name} bằng tiếng Việt. 
        Lời chúc cần:
        - Có sự hài hước dí dỏm
        - Thể hiện sự trân trọng với vai trò của người phụ nữ trong gia đình và xã hội
        - Có chất miền Tây gần gũi
        - Mang tính sáng tạo và độc đáo, tránh những câu chúc sáo rỗng thông thường
        - Dài khoảng 4-5 câu ngắn gọn nhưng ý nghĩa
        Không cần thêm các từ mở đầu như "Thân gửi" hay "Chúc mừng".`;

        try {
            const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Lỗi khi tạo lời chúc:', error);
            return `${name} ơi, em đẹp như hoa lục tỉnh, lanh lợi hơn cả gió miền Tây! Chịu khó lo cho gia đình, xã hội mà vẫn giữ được nụ cười tươi rói, thiệt là "đỉnh của chóp". Chúc em 8/3 vui như hội, hạnh phúc ngập tràn như sông Cửu Long!`;
        }
    }

    function getRandomBackground() {
        const randomIndex = Math.floor(Math.random() * backgroundStyles.length);
        return backgroundStyles[randomIndex];
    }

    async function downloadCard() {
        try {
            const canvas = await html2canvas(cardContent, {
                scale: 2,
                logging: false,
                allowTaint: true,
                useCORS: true
            });

            const link = document.createElement('a');
            link.download = 'thiep-chuc-8-3.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Lỗi khi tạo ảnh:', error);
            alert('Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại!');
        }
    }

    downloadBtn.addEventListener('click', downloadCard);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();
        
        if (!name) return;

        // Hiệu ứng loading
        greetingMessage.textContent = 'Đang sáng tác lời chúc...';
        greetingCard.classList.remove('hidden');
        recipientName.textContent = name;

        // Chọn background ngẫu nhiên
        cardContent.className = 'relative w-full aspect-[4/3] rounded-2xl overflow-hidden card-background';
        cardContent.classList.add(getRandomBackground());

        // Tạo và hiển thị lời chúc
        const greeting = await generateGreeting(name);
        greetingMessage.textContent = greeting;

        // Animation cho lời chúc
        greetingMessage.classList.add('greeting-appear');
        setTimeout(() => {
            greetingMessage.classList.add('active');
        }, 100);

        // Reset form
        nameInput.value = '';
    });
});