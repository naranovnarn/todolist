document.addEventListener("DOMContentLoaded", function () {
    const url = "http://localhost:3000/tasks";

    const addButton = document.querySelector(".add-task__button");
    const input = document.querySelector(".add-task__input");

    const actionButtons = document.querySelector(".action");
    const allTasks = document.querySelector(".action__alltasks");
    const activeButton = document.querySelector(".action__active");
    const completeButton = document.querySelector(".action__completed");

    const taskList = document.querySelector(".task-list");

    let id = 10;

    addButton.addEventListener("click", addTask);
    input.addEventListener("keydown", addEnter);
    completeButton.addEventListener("click", renderCompletedTasks);
    activeButton.addEventListener("click", renderActiveTasks);
    allTasks.addEventListener("click", renderAllTasks);

    renderAllTasks();

    function renderAllTasks(e) {
        fetch(url)
            .then(response => response.json())
            .then(allTasks => {
                render(allTasks);
            });
        deleteClassFocus();
        e ? e.currentTarget.classList.add("focusButton") : "";
    }

    function renderActiveTasks(e) {
        const url = "http://localhost:3000/tasks?completed=false";

        fetch(url)
            .then(response => response.json())
            .then(activeTasks => {
                render(activeTasks);
            });

        deleteClassFocus();
        e.currentTarget.classList.add("focusButton");
    }

    function renderCompletedTasks(e) {
        const url = "http://localhost:3000/tasks?completed=true";

        fetch(url)
            .then(response => response.json())
            .then(completedTasks => {
                render(completedTasks);
            });

        deleteClassFocus();
        e.currentTarget.classList.add("focusButton");
    }

    function addTask() {
        if (input.value.trim() === "") {
            return;
        }

        const taskName = input.value;
        const newTask = {
            name: taskName,
            id: `${id}`,
            completed: "false"
        };

        id++;

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(newTask)
        }).then(() => {
            fetch(url)
                .then(response => response.json())
                .then(allTasks => {
                    render(allTasks);
                });
        });

        resetInputValue();
    }

    function addEnter(e) {
        if (e.code === "Enter") {
            addTask();
        }
    }

    function render(tasks) {
        removeTasks();
        tasks.forEach(item => {
            const li = document.createElement("li");

            li.classList.add("task-list__item");
            li.setAttribute("data-index", item.id);
            li.innerHTML = `
<input type="checkbox" ${item.completed === "true" ? "checked" : ""}>
<span>${item.name}</span>
<input type="text" class="hide">
<button class="hide">save</button>
<i class="fa fa-trash-o delete-task"></i>
      `;

            if (item.completed === "true") {
                li.classList.add("_completed");
            }

            li.addEventListener("click", function(e) {
                const target = e.target;
                if (target.tagName === "I") {
                    deleteTask(target);
                    return;
                }
                if (target.tagName === "BUTTON") {
                const input = target.parentNode.querySelector("input[type='text']");
                const name = input.value; // тут косяк

                debugger

                    saveNewTask(target, name);
                    return;
                }

            });

            li.addEventListener("dblclick", function (e) {
                const target = e.target;
                const input = target.parentNode.querySelector(".hide");
                const button = target.parentNode.querySelector("BUTTON");
                if (target.tagName === "SPAN") {
                    editTask(target, input, button);
                }
            })

            li.addEventListener("change", function (e) {
                const target = e.target;
                const name = target.parentNode.querySelector("span").innerText;
                if (target.tagName === "INPUT") {
                    changeStatusTask(target, name)
                }

            });

            taskList.appendChild(li);
        });

        renderCountTasks(tasks);
        resetInputValue();
    }

    function deleteTask(event) {
        const id = +event.parentElement.getAttribute("data-index");

        fetch(`${url}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        }).then(() => {
            fetch(url)
                .then(response => response.json())
                .then(allTasks => {
                    render(allTasks);
                });
        });
    }

    function resetInputValue() {
        input.value = "";
    }

    function removeTasks() {
        // TODO: без while
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
    }

    function changeStatusTask(target, name) {
        const id = +target.parentElement.getAttribute("data-index");
        const newTask = {
            name: name,
            id: id,
            completed: `${event.target.checked}`
        };

        fetch(`${url}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(newTask)
        })
            .then(() => {
                fetch(url)
                    .then(response => response.json())
                    .then(allTasks => {
                        render(allTasks);
                    });
            });
    }

    function renderCountTasks() {
        fetch(url)
            .then(response => response.json())
            .then(result => {
                allTasks.innerHTML = `<span>AllTasks:</span> <span>${result.length}</span>`;
                activeButton.innerHTML = `<span>Active:</span> <span>${
                    result.filter(item => item.completed === "false").length
                    }</span>`;
                completeButton.innerHTML = `<span>Completed:</span> <span>${
                    result.filter(item => item.completed === "true").length
                    }</span>`;
            });
    }

    function deleteClassFocus() {
        // TODO: без for
        for (let i = 0; i < actionButtons.children.length; i++) {
            actionButtons.children[i].classList.remove("focusButton");
        }
    }

    // TODO: refactor me
    function editTask(target, input, button) {
        target.classList.add("hide");
        input.classList.remove("hide");
        button.classList.remove("hide");
        input.value = target.innerHTML;
    }

    function saveNewTask(target, name) {
        const id = +target.parentElement.getAttribute("data-index");
        debugger

        const newTask = {
            name: name,
            id: id,
            completed: `${target.parentElement.children[0].checked}`
        };

        fetch(`${url}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(newTask)
        })
            .then(() => {
                fetch(url)
                    .then(response => response.json())
                    .then(allTasks => {
                        render(allTasks);
                    });
            });
    }
});
