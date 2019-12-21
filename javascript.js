document.addEventListener('DOMContentLoaded', function () {

        const todoList = new TodoList();


        const addButton = document.querySelector('.add-task__button')
        const taskList = document.querySelector('.task-list');
        const input = document.querySelector('.add-task__input');
        const completeButton = document.querySelector('.action__completed');
        const activeButton = document.querySelector('.action__active');
        const allTasks = document.querySelector('.action__alltasks');


        addButton.addEventListener('click', addTask);

        function addTask() {

            const taskName = input.value;

            todoList.add(taskName);

            render();
        }

        input.addEventListener('keydown', addEnter);

        function addEnter(e) {
            if (event.code == 'Enter') {
                addTask();
            }
        }


        function render() {

            removeTasks();

            const newArr = todoList.getAll();

            newArr.forEach((item, index) => {
                const li = document.createElement('li');
                li.classList.add('task-list__item');
                li.setAttribute('data-index', index);

                li.innerHTML = `<input type="checkbox" ${item.comleted ? "checked" : ''}> ${item.name} <i class="fa fa-trash-o delete-task"></i> `;
                const iconDelete = li.lastElementChild;
                iconDelete.addEventListener('click', deleteTask);

                const copmleteCheckbox = li.firstElementChild;
                copmleteCheckbox.addEventListener('change', completeTask);

                taskList.appendChild(li);
            })
        }

        function deleteTask(event) {
            const index = event.target.parentElement.getAttribute('data-index');
        }

        function removeTasks()  {
            while (taskList.firstChild) {
                taskList.removeChild(taskList.firstChild);
            }
        }

        function completeTask() {
            if (this.checked) {
                console.log(this.parentElement.innerText);
                return this.parentElement.classList.add('_completed');
            }
            this.parentElement.classList.remove('_completed');
        }
    }

);





function TodoList() {
    this.list = [];

    this.add = function (name) {
        this.list.push({
            name: name,
            completed: false,
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
        const indexDelete = this.list.findIndex(item => item.id);
        this.list.splice(index, 1);
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