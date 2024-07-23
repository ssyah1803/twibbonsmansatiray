const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const downloadButton = document.getElementById('download-btn');
const fileNameDisplay = document.getElementById('file-name');
const frameImg = new Image();
frameImg.src = 'twibbon_mpls.png';

// Resize canvas to maintain aspect ratio on mobile devices
function resizeCanvas() {
    const containerWidth = document.querySelector('.frame').offsetWidth;
    canvas.width = containerWidth;
    canvas.height = containerWidth; // assuming a square aspect ratio for simplicity
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

uploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Tampilkan nama file
    fileNameDisplay.textContent = file.name;

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Hitung rasio aspek dan ukur gambar dengan benar
            const canvasAspect = canvas.width / canvas.height;
            const imgAspect = img.width / img.height;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgAspect > canvasAspect) {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgAspect;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgAspect;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            // Gambar gambar yang diunggah ke kanvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            // Gambar frame di atas gambar yang diunggah
            context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

downloadButton.addEventListener('click', function() {
    // Pastikan frame digambar di atas sebelum mengunduh
    context.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

    // Memicu unduhan
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'MPLS_SMANSA_TIRAY.png';
    link.click();
});

// Menangani pembaruan teks template dinamis
const nameInput = document.getElementById('name-input');
const originInput = document.getElementById('origin-input');
const mottoInput = document.getElementById('motto-input');
const namePlaceholder = document.getElementById('name-placeholder');
const originPlaceholder = document.getElementById('origin-placeholder');
const mottoPlaceholder = document.getElementById('motto-placeholder');
const templateText = document.getElementById('template-text');
const notification = document.getElementById('notification');
const spamNotification = document.getElementById('spam-notification');

let lastCopyTime = 0; // Waktu terakhir kali salin teks

nameInput.addEventListener('input', function() {
    namePlaceholder.textContent = nameInput.value ? nameInput.value : '"Nama"';
});

originInput.addEventListener('input', function() {
    originPlaceholder.textContent = originInput.value ? originInput.value : ':Asal';
});

mottoInput.addEventListener('input', function() {
    mottoPlaceholder.textContent = mottoInput.value ? mottoInput.value : 'Pendidikan bukan hanya tentang mengisi pikiran, tetapi juga membentuk karakter.';
});

document.getElementById('copy-btn').addEventListener('click', function() {
    const now = Date.now();
    if (now - lastCopyTime < 2000) { // Cek jika klik terlalu cepat (kurang dari 2 detik)
        spamNotification.style.display = 'block';
        setTimeout(() => {
            spamNotification.style.opacity = '0';
            setTimeout(() => {
                spamNotification.style.display = 'none';
                spamNotification.style.opacity = '1'; // Reset opacity untuk tampilan berikutnya
            }, 500);
        }, 2000); // Tampilkan selama 2 detik
        return;
    }
    
    lastCopyTime = now; // Update waktu terakhir kali salin teks

    const text = templateText.textContent;
    navigator.clipboard.writeText(text).then(function() {
        // Tampilkan notifikasi sukses
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
                notification.style.opacity = '1'; // Reset opacity untuk tampilan berikutnya
            }, 500);
        }, 2000); // Tampilkan selama 2 detik
    }, function(err) {
        console.error('Gagal menyalin teks: ', err);
    });
});
