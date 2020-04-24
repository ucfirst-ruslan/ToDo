const localKey = '_todo';
let editItemNow = false;
let dataTODO = [{
    'id': 1,
    'status': true,
    'todo': 'Next Lesion ProCode IT School - 2020-04-25 11:00'
}];

//Primary load|reload page
function loadPage() {
    let dataStor = JSON.parse(getStorage());

    if(dataStor) {
        dataTODO = dataStor;
    }
    addStorage(dataTODO);
    createItems(dataTODO);
}


//Listeners
let ul = document.querySelector("#list");
ul.addEventListener('click', (event) => {
    let target = event.target;

    switch(target.className) {
        case 'remove':
            deleteItem (target);
            break;
        case 'edit':
            editItem(target);
            break;
        case 'save-edit':
            saveEditItem(target);
            break;
        case 'progress':
            !editItemNow ? statusItem(target) : '';
            break;
        case 'check':
            !editItemNow ? statusItem(target) : '';
            break;
    }
});
// Double click
ul.addEventListener('dblclick', (event) => {
    let target = event.target;

    if (target.className === 'text') {
        editItem(target.nextSibling);
    }
});


// Save item
function saveEditItem(target) {
    let editTODO = target.previousSibling.querySelector('input').value;

    if (editTODO) {
        target.classList.remove("save-edit");
        target.classList.add("edit");
        target.previousSibling.innerHTML = editTODO;

        let index = target.parentElement.getAttribute("id-todo");
        for (let data in dataTODO) {

            if (dataTODO[data].id == index) {
                dataTODO[data].todo = editTODO;
            }
        }
        editItemNow = false;
        addStorage(dataTODO);
    }
}

//Edit item
function editItem(target) {
    editItemNow = true;
    let index = target.parentElement.getAttribute("id-todo"); // индекс
    let textTODO = target.previousSibling.innerHTML; // содержимое ячейки

    target.previousSibling.innerHTML = `<input type="text" class="edit-todo" value="${textTODO}" required autofocus>`;
    target.classList.remove("edit");
    target.classList.add("save-edit");
}

// Delete item
function deleteItem(target) {
    let index = target.parentElement.getAttribute("id-todo");

    for (let data in dataTODO) {

        if (dataTODO[data].id == index) {
            dataTODO.splice(data, 1);
        }
    }

    target.parentElement.remove();
    addStorage(dataTODO);
}

// Functions switch status
function statusItem(target) {
    let status;

    if (target.classList.contains('progress')) {
        target.classList.remove("progress");
        target.classList.add("check");
        target.nextSibling.classList.add("completed");
        target.nextSibling.nextSibling.classList.add("hide-icon");
        status = false;
    } else {
        target.classList.remove("check");
        target.classList.add("progress");
        target.nextSibling.classList.remove("completed");
        target.nextSibling.nextSibling.classList.remove("hide-icon");
        status = true;
    }
    statusItemToStorage(target, status);
}
//
function statusItemToStorage(target, status) {
    let index = target.parentElement.getAttribute("id-todo");

    for (let data in dataTODO) {

        if (dataTODO[data].id == index) {
            dataTODO[data].status = status;
        }
    }
    //console.log(dataTODO);
    addStorage(dataTODO);
}

// Listeners. Add new item
// if click
let btn = document.querySelector('.btn');
btn.addEventListener('click',  addItem);

// if press "enter" key
let input = document.querySelector('input');
input.addEventListener('keypress', (keyPressed) => {

    if(keyPressed.key === 'Enter') {
        addItem();
    }
});

// Add item
function addItem() {
    let input = document.querySelector('input');

    if (input.value) {
        let curTime = new Date().getTime();
        let data = {'id': curTime, 'status': true, 'todo': input.value};

        dataTODO.push(data);

        addStorage(dataTODO);
        createItems([data]);

        input.value = '';
    }
}

//Create item in to-do list
function createItems(data) {
    // Sort by "status"
    data.sort(function(obj1, obj2) {
        return obj2.status - obj1.status;
    });

    for (let item of data) {
        let ul = document.getElementById('list');
        let li = document.createElement("li");

        if (item.status) {
            li.innerHTML = '<span class="progress"></span>';
            li.innerHTML += `<span class="text">${item.todo}</span>`;
            li.innerHTML += '<span class="edit"></span><span class="remove"></span>';
        } else {
            li.innerHTML = '<span class="check"></span>';
            li.innerHTML += `<span class="text completed">${item.todo}</span>`;
            li.innerHTML += '<span class="edit hide-icon"></span><span class="remove"></span>';
        }
        li.setAttribute("draggable", "true");
        li.setAttribute("id-todo", item.id);
        ul.appendChild(li);
    }
}

// Add array in storage
function addStorage(data){
    let value = JSON.stringify(data);

    localStorage.removeItem(localKey);
    localStorage.setItem(localKey, value);
}

//Get array from storage
function getStorage() {
    return localStorage.getItem(localKey);
}

loadPage();

