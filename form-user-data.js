 const storageKey = 'STORAGE_KEY';
  const submitAction = document.getElementById('form-data-user');


//   memeriksa apakah fitur web storage didukung oleh browser yang kita gunakan melalui sebuah fungsi bernama checkForStorage()

function checkForStorage(){
    return typeof (storage) !== 'undefined';
}

// fungsi checkForStorage() akan mengembalikan nilai true jika fitur web storage didukung oleh browser dan false jika tidak.


// fungsi putUserList() berguna untuk membuat item storage
// membuat nilai awal serta memodifikasi nilai pada item storage-nya
 function putUserList(data) {
    if (checkForStorage()) {
      let userData = [];
      if (localStorage.getItem(storageKey) !== null) {
        userData = JSON.parse(localStorage.getItem(storageKey));
      }
 
      userData.unshift(data);
      if (userData.length > 5) {
        userData.pop();
      }
 
      localStorage.setItem(storageKey, JSON.stringify(userData));
    }
  }

// fungsi di atas memeriksa apakah fitur web storage sudah didukung melalui fungsi checkForStorage()
// Jika iya, kita akan membuat sebuah variabel bernama userData yang akan menampung semua data pada item storage.
// Jika item storage yang digunakan belum dibuat, kita akan memberikan nilai array kosong ke variabel userData
// Jika tidak, kita akan mengambil data yang disimpan dan memasukkannya ke fungsi JSON.parse().
//  JSON.parse()? Fungsi tersebut berguna untuk mengonversi sebuah JSON yang ditulis dalam bentuk string ke bentuk JSON "asli"




// getUserList() yang berguna untuk mendapatkan semua data pada item storage yang berisi data user yang sudah di-input
function getUserList() {
    if (checkForStorage()) {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } else {
      return [];
    }
  }


// menambahkan fungsi untuk merender data user pada tabel HTML
function renderUserList() {
    const userData = getUserList();
    const userList = document.querySelector('#user-list-detail');
    userList.innerHTML = '';
    for (let user of userData) {
      let row = document.createElement('tr');
      row.innerHTML = '<td>' + user.nama + '</td>';
      row.innerHTML += '<td>' + user.umur + '</td>';
      row.innerHTML += '<td>' + user.domisili + '</td>';
      
      userList.appendChild(row);
    }
  } 

//Kemudian kita akan menambahkan event listener ke tombol submit untuk mengambil semua data yang sudah di-input ke semua field di form.
// Lalu kita akan menyimpannya pada item storage melalui fungsi putUserList().
// Selanjutnya daftar user yang baru saja kita masukkan akan langsung ditampilkan melalui fungsi renderUserList()

 submitAction.addEventListener('submit', function (event) {
    const inputNama = document.getElementById('nama').value;
    const inputUmur = document.getElementById('umur').value;
    const inputDomisili = document.getElementById('domisili').value;
    const newUserData = {
      nama: inputNama,
      umur: inputUmur,
      domisili: inputDomisili,
    };
 
    putUserList(newUserData);
    renderUserList();
  });

// kita akan menambahkan event listener ke objek window untuk event "load"
// Event handler-nya akan berisi perintah untuk menampilkan semua data yang sudah kita input ke dalam item storage.

window.addEventListener('load', function () {
    if (checkForStorage) {
      if (localStorage.getItem(storageKey) !== null) {
        renderUserList();
      }
    } else {
      alert('Browser yang Anda gunakan tidak mendukung Web Storage');
    }
  });

