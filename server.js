const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(__dirname + "/build"));

app.get("/", (req, res) =>
  res.sendFile("/build/index.html", { root: __dirname + "/" })
);

app.get("*", (req, res) => res.redirect("/"));

app.listen(port, () => console.log(`Doors open on port ${port}!`));
