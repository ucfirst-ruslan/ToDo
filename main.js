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
    setStorage(dataTODO);
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
        setStorage(dataTODO);
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
    target.parentElement.classList.remove('fadeIn');
    target.parentElement.classList.add('fadeOut');
    setTimeout(() => {target.parentElement.remove()}, 400);
    setStorage(dataTODO);
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
    setStorage(dataTODO);
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

        setStorage(dataTODO);
        createItems([data]);

        input.value = '';
    }
}

//Create item in to-do list
function createItems(data) {
    // // Sort by "status"
    // data.sort(function(obj1, obj2) {
    //     return obj2.status - obj1.status;
    // });

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
        li.classList.add('animated', 'fadeIn', 'delay-0.4s')
        li.setAttribute("draggable", "true");
        li.setAttribute("id-todo", item.id);
        ul.appendChild(li);
    }
}

// Add array in storage
function setStorage(data){
    let value = JSON.stringify(data);

    localStorage.removeItem(localKey);
    localStorage.setItem(localKey, value);
}

//Get array from storage
function getStorage() {
    return localStorage.getItem(localKey);
}

loadPage();


// Drag'n'Drop
let dragging = null;

document.addEventListener('dragstart', (event) => {

    let target = getLi( event.target );
    dragging = target;
    dragging.style['filter'] = 'blur(4px)';
    dragging.style['opacity'] = '.6';
    event.dataTransfer.setData('text/plain', null);
});

document.addEventListener('dragover', (event) => {
    event.preventDefault();

    let target = getLi( event.target );
    let bounding = target.getBoundingClientRect()
    let offset = bounding.y + (bounding.height/2);

    if (event.clientY - offset > 0) {
        target.style['border-bottom'] = 'solid 2px red';
        target.style['border-top'] = '';
    } else if (event.clientY - offset < 0){
        target.style['border-top'] = 'solid 2px red';
        target.style['border-bottom'] = '';
    }
});

document.addEventListener('dragleave', (event) => {
    let target = getLi( event.target );
    target.style['border-bottom'] = '';
    target.style['border-top'] = '';
});

document.addEventListener('drop', (event) => {
    event.preventDefault();

    let target = getLi( event.target );
    dragging.style['filter'] = '';
    dragging.style['opacity'] = '';

    if (target.style['border-bottom'] !== '') {
        target.style['border-bottom'] = '';
        target.parentNode.insertBefore(dragging, event.target.nextSibling);
    } else {
        target.style['border-top'] = '';
        target.parentNode.insertBefore(dragging, event.target);
    }
    addItemForDrag();
});

function getLi( target ) {

    while ( target.nodeName.toLowerCase() !== 'li' && target.nodeName.toLowerCase() !== 'body' ) {
        target = target.parentNode;
    }
    if ( target.nodeName.toLowerCase() === 'body' ) {
        return false;
    } else {
        return target;
    }
}

function addItemForDrag() {
    let items = [];
    for (let item of ul.childNodes) {

        let index = item.getAttribute("id-todo");
        let textTODO = item.firstChild.nextSibling.innerHTML;

        let status;
        if (item.firstChild.classList.value === 'progress') {
            status = true;
        } else {
            status = false;
        }

        items.push({'id': index, 'status': status, 'todo': textTODO});
    }

    dataTODO = items;
    setStorage(dataTODO);
}
