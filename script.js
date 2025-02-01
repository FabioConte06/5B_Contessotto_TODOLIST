let todos = [];
const todoInput = document.getElementById("todoInput");
const insertButton = document.getElementById("insertButton");
const todoList = document.getElementById("todoList");

const render = () => {
    todoList.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = todo.name;
        li.style.textDecoration = "line-through";
        const completeButton = document.createElement("button");
        completeButton.textContent = "Completa";
        completeButton.onclick = () => completeTodo(todo);
        li.appendChild(completeButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Elimina";
        deleteButton.onclick = () => deleteTodo(todo.id);
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    });
};

const send = (todo) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/add", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo)
        })
        .then((response) => response.json())
        .then((json) => {
            resolve(json);
        });
    });
};

const load = () => {
    return new Promise((resolve, reject) => {
        fetch("/todo")
        .then((response) => response.json())
        .then((json) => {
            resolve(json);
        });
    });
};

const completeTodo = (todo) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/complete", {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo)
        })
        .then((response) => response.json())
        .then((json) => {
            resolve(json);
        });
    });
};

const deleteTodo = (id) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/" + id, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        })
        .then((response) => response.json())
        .then((json) => {
            resolve(json);
        });
    });
};

insertButton.onclick = () => {
    const todo = {
        name: todoInput.value,
        completed: false
    };
    send({ todo: todo })
        .then(() => load())
        .then((json) => {
            todos = json.todos;
            todoInput.value = "";
            render();
        });
};

load().then((json) => {
    todos = json.todos;
    render();
});

setInterval(() => {
    load().then((json) => {
        todos = json.todos;
        render();
    });
}, 30000);