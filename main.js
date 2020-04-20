const localKey = '_todo';
let dataTODO = [];

//Primary load page
function loadPage() {
    dataTODO = JSON.parse(localStorage.getItem(localKey));

    if(!dataTODO || dataTODO.length === 0) {
        dataTODO = [{
            'id': 1,
            'todo': 'Next Lesion ProCode IT School - 2020-04-25 11:00'
        }];
        addStorage(dataTODO);
    }
    createItem(dataTODO);
}


//Delete item
let ul = document.querySelector("#list");
ul.addEventListener('click', (event) => {
    let target = event.target;

    let index = target.getAttribute("id-todo");
    for (let data in dataTODO) {

        if (dataTODO[data].id == index) {
            dataTODO.splice(data, 1);
        }
    }
    target.remove();

    addStorage(dataTODO);
});


//Add item
let btn = document.querySelector('.btn');
btn.addEventListener('click',  () => {

    let input = document.querySelector('input');
    if (input.value) {
        let curTime = new Date().getTime();
        let data = {'id': curTime, 'todo': input.value};

        dataTODO.push(data);

        addStorage(dataTODO);
        createItem([data]);

        input.value = '';
    }
});

//Create item in to-do list
function createItem(data) {
    for (let item of data) {
        let ul = document.getElementById('list');
        let li = document.createElement("li");

        li.innerHTML = item.todo;
        li.setAttribute("id-todo", item.id);
        ul.appendChild(li);
    }
}

function addStorage(data){
    let value = JSON.stringify(data);
    localStorage.setItem(localKey, value);
}

loadPage();
