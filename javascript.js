document.addEventListener('DOMContentLoaded', function () {

        const todoList = new TodoList();


        const addButton = document.querySelector('.add-task__button')
        const taskList = document.querySelector('.task-list');
        const input = document.querySelector('.add-task__input');
        const completeButton = document.querySelector('.action__completed');
        const activeButton = document.querySelector('.action__active');
        const allTasks = document.querySelector('.action__alltasks');
        const actionButtons = document.querySelector('.action');

        let id = 0;


        addButton.addEventListener('click', addTask);
        input.addEventListener('keydown', addEnter);
        completeButton.addEventListener('click', renderCompletedTasks);
        activeButton.addEventListener('click', renderActive);
        allTasks.addEventListener('click', renderAlltasks);

        function addTask() {

            if (input.value.trim() == '') {
                return;
            }
            const taskName = input.value;

            todoList.add(taskName, id);

            id++;

            render(todoList.getAll());
        }


        function addEnter(e) {
            if (e.code == 'Enter') {
                addTask();
            }
            
        }

        function render(tasks) {
            removeTasks();

            tasks.forEach(item => {
                const li = document.createElement('li');

                li.classList.add('task-list__item');
                li.setAttribute('data-index', item.id);
                li.innerHTML = `<input type="checkbox" ${item.completed ? "checked" : ''}>${item.name}<i class="fa fa-trash-o delete-task"></i> `;

                if (item.completed) {
                    li.classList.add('_completed');
                }

                const iconDelete = li.lastElementChild;
                const copmleteCheckbox = li.firstElementChild;

                iconDelete.addEventListener('click', deleteTask);
                copmleteCheckbox.addEventListener('change', changeStatusTask);

                taskList.appendChild(li);
            });

            renderCountTasks();

            resetInputValue();
        }


        function renderCompletedTasks(e) {
            deleteClassFocus();
            e.currentTarget.classList.add('focusButton');

            render(todoList.getCompleted());
            renderCountTasks();
              
        }

        function renderActive(e) {

            deleteClassFocus();
            e.currentTarget.classList.add('focusButton');

            render(todoList.getActive());
            renderCountTasks();
         

        }

        function deleteTask(event) {

            const id = +event.target.parentElement.getAttribute('data-index');
            todoList.remove(id);
            render(todoList.getAll());
            renderCountTasks();

        }

        function resetInputValue() {
            input.value = '';
        }

        function removeTasks() {
            while (taskList.firstChild) {
                taskList.removeChild(taskList.firstChild);
            }
        }

        function renderAlltasks(e) {

            deleteClassFocus();
            e.currentTarget.classList.add('focusButton');

            render(todoList.getAll());
            renderCountTasks();
           
        }

        function changeStatusTask(event) {
            if (event.target.checked) {
                const id = +event.target.parentElement.getAttribute('data-index');
                todoList.changeStatusOn(id);
                renderCountTasks();
                return this.parentElement.classList.add('_completed');
                
            }

            const id = +event.target.parentElement.getAttribute('data-index');
            todoList.changeStatusOff(id);
            this.parentElement.classList.remove('_completed');
            renderCountTasks();
        }

        function renderCountTasks() {
            allTasks.innerHTML = `<span>AllTasks:</span> <span>${todoList.getAll().length}</span>`;
            activeButton.innerHTML = `<span>Active:</span> <span>${todoList.getActive().length}</span>`;
            completeButton.innerHTML = `<span>Completed:</span> <span>${todoList.getCompleted().length}</span>`;
        }


        function deleteClassFocus() {
    
            for (let i = 0; i < actionButtons.children.length ; i++) {

            actionButtons.children[i].classList.remove('focusButton');
        
            }

        }



    }

);

function TodoList() {
    this.list = [];

    this.add = function (name, id) {
        this.list.push({
            name: name,
            completed: false,
            id: id
        });
    }

    this.getAll = function () {
        return this.list;
    }

    this.getActive = function () {
        const activeTasks = this.list.filter(item => !item.completed);

        return activeTasks;
    }

    this.getCompleted = function () {
        const completedTasks = this.list.filter(item => item.completed);

        return completedTasks;
    }

    this.remove = function (id) {
        const indexDelete = this.list.findIndex(item => item.id == id);
        this.list.splice(indexDelete, 1);
    }

    this.changeStatusOn = function (id) {
        this.list.forEach(item => {
            if (item.id == id) {
                item.completed = true;
            }
        })
    }

    this.changeStatusOff = function (id) {
        this.list.forEach(item => {
            if (item.id == id) {
                item.completed = false;
            }
        })
    }
}




// deleteButton.addEventListener('click', deleteCompletedTask);

// function deleteCompletedTask() {
//     const allTasks = Array.from(document.querySelectorAll('li'));
//     const completeTasks = allTasks.filter(item => item.className.includes('_completed'));
//     const activeTasks = allTasks.filter(item => !item.className.includes('_completed'));

//     completeTasks.forEach(item => item.classList.remove('_hide'));
//     activeTasks.forEach(item => item.classList.add('_hide'));
// }


// activeButton.addEventListener('click', showActive);

// function showActive() {
//     const allTasks = Array.from(document.querySelectorAll('li'));
//     const completeTasks = allTasks.filter(item => item.className.includes('_completed'));
//     const activeTasks = allTasks.filter(item => !item.className.includes('_completed'));

//     completeTasks.forEach(item => item.classList.add('_hide'));
//     activeTasks.forEach(item => item.classList.remove('_hide'));
// }


// allTasks.addEventListener('click', showAllTasks);

// function showAllTasks() {
//     const allTasks = Array.from(document.querySelectorAll('li'));

//     allTasks.forEach(item => item.classList.remove('_hide'));
// }

// if (input.value.trim() == '') {
//     return;
// }

// const li = document.createElement('li');
// li.innerHTML = `<input type="checkbox"> ${input.value} <i class="fa fa-trash-o delete-task"></i> `;
// li.classList.add('task-list__item');
// taskList.appendChild(li);


// const iconDelete = li.lastElementChild;
// iconDelete.addEventListener('click', deleteTask);

// const copmleteCheckbox = li.firstElementChild;
// copmleteCheckbox.addEventListener('change', completeTask);
// // copmleteCheckbox.onchange = completeTask;
// clearInput();

// function clearInput() {
//     input.value = '';
// }

// function deleteTask(e) {
//     e.target.parentElement.remove();
// }

// input.addEventListener('keydown', addEnter);

// function addEnter(e) {
//     if (event.code == 'Enter') {
//         addTask();
//     }
// }

// function completeTask() {
//     if (this.checked) {
//         return this.parentElement.classList.add('_completed');
//     }
//     this.parentElement.classList.remove('_completed');
// }