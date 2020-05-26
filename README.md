# Hackathon

Anda wajib menggunakan repositori ini sebagai titik mula pengerjaan tugas.
Jangan lupa untuk mengganti nama pada judul halaman HTML yang tersedia dengan NRP Anda.

1. Clone repositori Tugas-1 Anda masing-masing dari Github ke komputer. Repositori ini akan menjadi dasaran pengerjaan Tugas Hackathon ini. Silakan ganti judul halaman HTML dengan "Tugas Hackathon - NRP Anda". Commit dengan pesan "Hackathon #1", lalu Push repositori Anda ke Github.
2. Hentikan animasi rotasi pada kedua kanvas. Commit dengan pesan "Hackathon #2", lalu Push repositori Anda ke Github.
3. Tambahkan sebuah bidang datar bewarna `#xyzxyz` seluas `10`x`10` unit pada kedua kanvas, dengan xyz adalah tiga digit terakhir NRP Anda. Bidang ini diposisikan sedemikian rupa sehingga dia menjadi alas dari obyek utama yang Anda punya. Commit dengan pesan "Hackathon #3", lalu Push repositori Anda ke Github.
4. Implementasikan pencahayaan Ambient dengan nilai `0.2` untuk semua warna. Commit dengan pesan "Hackathon #4", lalu Push repositori Anda ke Github.
5. Implementasikan pencahayaan Diffuse warna `putih` dengan asumsi sumber cahaya sangat jauh seperti cahaya matahari (_directional ray_ bukan _point light_). Simulasikan cahaya (matahari) ini seolah mengitari obyek, terbit dari kanan kanvas, tenggelam di kiri kanvas, sehingga tampak seperti simulasi siang-malam. Commit dengan pesan "Hackathon #5", lalu Push repositori Anda ke Github.
6. Buatlah animasi kamera untuk kanvas sebelah kanan, dimana kamera ini menyimulasikan _first person view_. Bila ditekan tombol depan (_up arrow key_), maka kamera akan berjalan maju. Bila ditekan tombol belakang (_down arrow key_) kamera akan berjalan mundur. Bila ditekan tombol kanan (_right arrow key_) kamera akan berputar ke kanan (menengok ke kanan). Bila ditekan tombol kiri (_left arrow key_) kamera akan berputar ke kiri (_menengok ke kiri_). Commit dengan pesan "Hackathon #6", lalu Push repositori Anda ke Github.

## Hackathon #1

Mengganti judul halaman HTML menjadi "Tugas Hackathon - 5104100118";

![Hackathon #1](hackathon1.jpg)

## Hackathon #2

Menghentikan animasi rotasi pada kedua kanvas dengan memodifikasi definisi `attribute`, `uniform`, dan baris code pada shader terkait;

![Hackathon #2](hackathon2.jpg)

## Hackathon #3

Menambah sebuah bidang datar (alas obyek) bewarna `#118118`, yakni r: `17`, g: `129`, b: `24` pada skala 0-255, atau r: `0.06666666667` g:`0.5058823529` b:`0.09411764706` pada skala 0-1); Warna kotak pada kanvas sebelah kiri yang awalnya abu-abu sekalian saya ubah jadi merah supaya identik dengan warna kotak pada kanvas sebelah kanan; Baik kanvas sebelah kiri maupun kanan telah saya atur agar sama-sama memiliki bidang datar (alas obyek), hanya saja tidak terlihat pada kanvas sebelah kiri, karena tidak ada perspektif. Kamera pada kanvas sebelah kanan saya letakkan di posisi `-5.5`;

![Hackathon #3](hackathon3.jpg)

## Hackathon #4

Mengimplementasikan pencahayaan ambient dengan nilai (intensitas) sebesar `0.2` untuk semua warna; Sebagai hasilnya warna fragmen-fragmen pada kedua kanvas akan meredup karena asumsinya mereka hanya menerima 1/5 cahaya putih;

![Hackathon #4](hackathon4.jpg)

## Hackathon #5

Mengimplementasikan pencahayaan diffuse direksional bewarna putih dari kanan kanvas ke kiri kanvas; Pustaka glMatrix digunakan untuk memudahkan proses perhitungan matriks normal, model, dan view; Posisi kamera untuk sisi kanan sengaja diubah agar bisa memperlihatkan efek pencahayaan secara jelas; Pencahayaan sebenarnya juga sudah diimplementasikan di kanvas kanan, hanya saja fragmen (sisi depan) yang bersangkutan tidak terkena efek pencahayaan karena vektor normalnya ortogonal terhadap arah datang cahaya.

![Hackathon #5](hackathon5.gif)

## Hackathon #6

Menggunakan bantuan fungsi lookAt milik glMatrix berikut fungsi transformasi matriks lainnya untuk menyimulasikan pandangan orang pertama; Konsep Trigonometri banyak digunakan di sini untuk memodelkan algoritmen pergerakan.

![Hackathon #6](hackathon6.gif)
