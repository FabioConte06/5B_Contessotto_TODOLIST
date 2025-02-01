let http = require("http");
http.createServer(function (request, response) {
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end('Ciao!\n');
}).listen(80);

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));

app.post("/todo/add", (req, res) => {
    const todo = req.body.todo;
    todo.id = "" + new Date().getTime();
    todos.push(todo);
    res.json({ result: "Ok" });
});

app.get("/todo", (req, res) => {
    res.json({ todos: todos });
});

app.put("/todo/complete", (req, res) => {
    const todo = req.body;
    try {
        todos = todos.map((element) => {
            if (element.id === todo.id) {
                element.completed = true;
            }
            return element;
        });
    } catch (e) {
        console.log(e);
    }
    res.json({ result: "Ok" });
});

app.delete("/todo/:id", (req, res) => {
    todos = todos.filter((element) => element.id !== req.params.id);
    res.json({ result: "Ok" });
});

const server = http.createServer(app);
server.listen(3000, () => {
  console.log("- server running");
});