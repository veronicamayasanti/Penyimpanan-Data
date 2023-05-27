

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('form'); 
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addTodo();
    })

     if (isStorageExist()) {
    loadDataFromStorage();
  }
});


    // catatan
    // document.addEventListener('DOMContentLoaded', function () {});
    // Kode di atas adalah sebuah listener yang akan menjalankan kode yang ada didalamnya ketika event DOMContentLoaded dibangkitkan alias ketika semua elemen HTML sudah dimuat menjadi DOM dengan baik.
    // Ketika semua elemen sudah dimuat dengan baik,
    // maka kita perlu mempersiapkan elemen form untuk menangani event submit,
    // di mana aksi tersebut dibungkus dan dijalankan oleh fungsi addTodo(), untuk menambahkan todo baru.
    // Akan tetapi, elemen form secara default akan memuat ulang secara otomatis website ketika submit.
    // Karena pada latihan ini kita akan menyimpan data dalam memory dan data tersebut akan hilang ketika dimuat ulang,
    // kita perlu memanggil method preventDefault() yang didapatkan dari object event.
    // Dengan demikian, data yang disimpan dalam memory akan terjaga dengan baik.



    // 1. Menampilkan Todo pada Console


    // membuat function addTodo
    function addTodo() {
        const textTodo = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;

        const generatedID = generateId();;
        const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
        todos.push(todoObject);

        document.dispatchEvent(new Event(RENDER_EVENT));  // untuk me-render data yang telah disimpan pada array todos.
        saveData();
    }



    // membuat function generatedID dan generateTodoObject
    function generateId() {    // berfungsi untuk menghasilkan identitas unik pada setiap item todo
        return +new Date();   // +new Date() untuk mendapatkan timestamp pada javaScript
    }


    function generateTodoObject(id, task, timestamp, isCompleted) {  // untuk membuat object baru dari data yang sudah disediakan dari inputan(parameter function)
        return {
            id,  
            task, // nama todo
            timestamp,  // waktu
            isCompleted  // penanda todo apakah sudah selesai atau belum
        }
    }
    
    const todos = [];   // array untuk menampung object yang berisi data Todo user
    const RENDER_EVENT = 'render-todo';  
    // variable RENDER_EVENT bertujuan untuk mendefiniskan custom event dengan nama 'render-todo'. 
    // digunakan sebagai patokan dasar ketika ada perubahan data pada variabel todos, misal perpindahan todo(dari incomplete menjadi complet dan sebaliknya), menambah, maupun menghapus todo.



    // listener dari RENDER_EVENT dengan menmpilkan array todos menggunakan console.log()
    // kode berikut ini berfungsu untuk memastikan kode diatas bisa berhasil
    document.addEventListener(RENDER_EVENT, function() {
        console.log(todos);
    })

    

    // 2. Menampilkan Item Todo dan Menandai Todo Selesai
    // membuat proses render sehingga todo todo hasil input user tampil di halaman web

    // membuat element pada bagian yang harus dilakukan
    // title, timestamp dan check button


    // menampilkan hasil input user ke dalam div yang harus dilakukan

    function makeTodo(todoObject) {
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.task; 


        const textTimestamp = document.createElement('p');
        textTimestamp.innerText = todoObject.timestamp;


        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimestamp);


        const container = document.createElement('div');
        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);



         //  implementasikan fungsi check, uncheck dan menghapus todo.
        if(todoObject.isCompleted){
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');

            undoButton.addEventListener('click', function(){
                undoTaskFromCompleted(todoObject.id);
            });


            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');

            trashButton.addEventListener('click', function() {
                removeTaskFromCompleted(todoObject.id);
            });


            container.append(undoButton, trashButton);
        }else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');
    
            checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
            });
    
            container.append(checkButton);
        }

        return container;

    }

    function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
 
    if (todoTarget == null) return;
 
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}



    function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
 
    if (todoTarget === -1) return;
 
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    }


    function findTodoIndex(todoId) {
    for (const index in todos) {
    if (todos[index].id === todoId) {
    return index;
    }
    }
 
    return -1;
}



    //  kode di dalam event handler dari custom event RENDER_EVENT untuk menerapkan makeTodo().

    document.addEventListener(RENDER_EVENT, function() {
        // console.log(todos);
        const uncompletedTODOList = document.getElementById('todos');
        uncompletedTODOList.innerText = '';

        const completedTODOList = document.getElementById('completed-todos');
        completedTODOList.innerHTML = '';

        for(const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            if (!todoItem.isCompleted) 
            uncompletedTODOList.append(todoElement);
            else
            completedTODOList.append(todoElement);
           
        }
    })
    
    // agar menampilkan data yang sesuai, misalnya todo yang belum dikerjakan akan diletakkan pada “Yang harus dibaca”.
    // memasang kondisi if statement untuk mem-filter hanya todo “Yang harus dibaca” saja lah yang perlu ditampilkan.
    /*

    Runtutan dari kode di atas adalah pertama elemen container dari todo kita ambil terlebih dahulu dari DOM. 
    Setelah itu, lakukan iterasi pada variabel todos untuk mengambil beberapa data todo yang telah tersimpan.

    Namun, untuk memastikan agar container dari todo bersih sebelum diperbarui, 
    maka kita perlu membersihkannya dengan memanggil property innerHTML = "". 
    Sehingga dengan mengatur property tersebut, tidak terjadi duplikasi data ketika menambahkan elemen DOM yang baru dengan append().

    Setiap iterasi yang dilakukan akan membuat satu elemen DOM, 
    yakni sebagai hasil dari fungsi makeTodo() yang kemudian dimasukkan pada variabel DOM yang sudah ada pada tampilan web (uncompletedTODOList) melalui fungsi append(). 
    Sehingga, elemen tersebut bisa langsung di-render oleh webpage.

    */


    // Agar fungsi check button bisa berfungsi,
    // untuk memindahkan todo dari rak “Yang harus dilakukan” ke “Yang sudah dilakukan”.
    function addTaskToCompleted (todoId) {
    const todoTarget = findTodo(todoId);
 
    if (todoTarget == null) return;
 
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}



// berfungsi untuk mencari todo dengan ID yang sesuai pada array todos.
    function findTodo(todoId) {
    for (const todoItem of todos) {
    if (todoItem.id === todoId) {
    return todoItem;
    }
    }
    return null;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
