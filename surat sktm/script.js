function generatePDF(data, callback) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Load the image
    const img = new Image();
    img.src = 'BALAI.png'; // Ganti dengan path gambar yang benar

    img.onload = function() {
        doc.addImage(img, 'PNG', 10, 10, 190, 34); // Atur posisi dan ukuran gambar sesuai kebutuhan

        doc.setFontSize(12);
        doc.text("SURAT KETERANGAN TIDAK MAMPU", 105, 50, null, null, 'center');
        doc.text(`Nomor: /282/SKTM/DSJ/2010.`, 105, 60, null, null, 'center');
        doc.text(`yang bertanda tangan di bawah ini Kepala Desa Surusunda, Kecamatan Karangpucung, Kabupaten`, 10, 70);
        doc.text(`Cilacap, Provinsi Jawa Tengah menerangkan dengan sebenarnya bahwa:`, 10, 75);

        doc.setFontSize(10);
        doc.text(`Nama Lengkap              : ${data.name}`, 10, 85);
        doc.text(`Tempat/Tanggal Lahir   : ${data.ttl}`, 10, 95);
        doc.text(`Agama                           : ${data.agama}`, 10, 105);
        doc.text(`Jenis Kelamin                : ${data.jenisKelamin}`, 10, 115);
        doc.text(`Alamat/Tempat Tinggal  : ${data.alamat}`, 10, 125);

        doc.text(`Benar nama yang tercantum di atas adalah warga Desa Sumber Jaya Kecamatan Siak Kecil Kabupaten Bengkalis.`, 10, 135);
        doc.text(`Dengan sepengetahuan kami dan sesuai data yang ada di kantor Desa, orang tersebut di atas benar keluarga`, 10, 140);
        doc.text(`kurang mampu (KELUARGA BERPENGHASILAN RENDAH). Surat Keterangan ini diberikan untuk mendapatkan`, 10, 145);
        doc.text(`pelayanan perobatan gratis.`, 10, 150);

        doc.text(`Demikian surat keterangan ini dibuat dengan sebenarnya untuk yang bersangkutan dan kiranya dapat dipergunakan`, 10, 160);
        doc.text(`seperlunya.`, 10, 165);
        doc.text(`TANGGAL: ${data.tanggal}`, 10, 175);

        doc.text(`Camat Surusunda`, 70, 190);
        doc.text(`....................`, 74, 206);
        doc.text(`Kepala Desa Surusunda`, 140, 190);
        doc.text(`....................`, 148, 206);

        // Save the PDF
        if (callback) {
            callback(doc);
        }
    };
}

function sendToWhatsApp() {
    const form = document.getElementById('sendForm');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Pastikan untuk mengambil nilai Agama dan Jenis Kelamin
    data.agama = document.getElementById('Agama').value; // Ambil nilai Agama
    data.jenisKelamin = document.getElementById('JenisKelamin').value; // Ambil nilai Jenis Kelamin

    generatePDF(data, function(doc) {
        doc.save('surat_pengantar.pdf');
        const whatsappUrl = `https://api.whatsapp.com/send?phone=+6285712354914&text=File%20PDF%20telah%20diunduh.%20Silakan%20unggah%20file%20tersebut%20untuk%20pembuatan%20SKTM.`;
        window.open(whatsappUrl, '_blank');
    });
}

function printForm() {
    window.print();
}