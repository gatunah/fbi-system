const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { results } = require("./data/agentes.js");
const port = 3002;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
//ESTÁTICOS
app.use(express.static("public"));

//
const secretKey = "clave_secreta_user";
// const token = jwt.sign(results[1], secretKey);

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/SignIn/aut", async (req, res) => {
  res.sendFile(__dirname + "/aut.html");
});
app.get("/SignIn/aut/restringido", async (req, res) => {
  res.sendFile(__dirname + "/restricted.html");
});

app.get("/token", async (req, res) => {
  res.send(token);
});

app.get("/SignIn", async (req, res) => {
  const { email, password } = req.query;
  //console.log(email, password);
  const result = results.find(
    (r) => r.email == email && r.password == password
  );

  if (result) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 120,
        data: result,
      },
      secretKey
    );
    res.status(200).json({ succes: true, email, password, token });
  } else {
    res
      .status(401)
      .json({
        succes: false,
        error: "401 No autorizado",
        message: "Usuario o contraseña incorrecta",
      });
  }
});
app.get("/restricted", async (req, res) => {
  let { token } = req.query;
  //console.log(token);

  jwt.verify(token, secretKey, (err, decoded) => {
    return err
      ? res.status(401).json({
          success: false,
          error: "401 No autorizado",
          message: err.message,
        })
      : res.status(200).json({ success: true, message: "Autorizado" });
  });
});
