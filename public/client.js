let todos = [];
const todoInput = document.getElementById("todoInput");
const insertButton = document.getElementById("insertButton");
const todoList = document.getElementById("todoList");

const render = () => {
    let html = "";
    todos.forEach(todo => {
        html += `<li>
                    ${todo.name}
                    <button class="complete-button" data-id="${todo.id}">Completa</button>
                    <button class="delete-button" data-id="${todo.id}">Elimina</button>
                 </li>`;
    });
    todoList.innerHTML = html;

    document.querySelectorAll(".complete-button").forEach(button => {

        button.onclick = () => {

            const id = button.getAttribute("data-id");

            completeTodo({ id }).then(() => {

                load().then((json) => {

                    todos = json.todos;

                    render();

                });

            });

        };

    });


    document.querySelectorAll(".delete-button").forEach(button => {

        button.onclick = () => {

            const id = button.getAttribute("data-id");

            deleteTodo(id).then(() => {

                load().then((json) => {

                    todos = json.todos;

                    render();

                });

            });

        };

    });

};

const send = (todo) => {

    return new Promise((resolve, reject) => {
 
       fetch("/todo/add", {
 
          method: 'POST',
 
          headers: {
 
             "Content-Type": "application/json"
 
          },
 
          body: JSON.stringify(todo)
 
       })
 
       .then((response) => response.json())
 
       .then((json) => {
 
          resolve(json); // risposta del server all'aggiunta
 
       })
 
    })
 
 }
 
 const load = () => {
 
    return new Promise((resolve, reject) => {
 
       fetch("/todo")
 
       .then((response) => response.json())
 
       .then((json) => {
 
          resolve(json); // risposta del server con la lista
 
       })
 
    })
 
 }

 insertButton.onclick = () => {

    const todo = {          
 
       name: todoInput.value,
 
       completed: false
 
    }      
 
    send({todo: todo}) // 1. invia la nuova Todo
 
     .then(() => load()) // 2. caricala nuova lista
 
     .then((json) => { 
 
       todos = json.todos;
 
       todoInput.value = "";
 
       render();  // 3. render della nuova lista
 
    });
 
 }

 const completeTodo = (todo) => {

    return new Promise((resolve, reject) => {
 
       fetch("/todo/complete", {
 
          method: 'PUT',
 
          headers: {
 
             "Content-Type": "application/json"
 
          },
 
          body: JSON.stringify(todo)
 
       })
 
       .then((response) => response.json())
 
       .then((json) => {
 
          resolve(json);
 
       })
 
    })
 
 }

 const deleteTodo = (id) => {

    return new Promise((resolve, reject) => {
 
       fetch("/todo/"+id, {
 
          method: 'DELETE',
 
          headers: {
 
             "Content-Type": "application/json"
 
          },
 
       })
 
       .then((response) => response.json())
 
       .then((json) => {
 
          resolve(json);
 
       })
 
    })
 
 }

 setInterval(() => {

    load().then((json) => {
 
       todos = json.todos;
 
       todoInput.value = "";
 
       render();
 
    });
 
 }, 8000);