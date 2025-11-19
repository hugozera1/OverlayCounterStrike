import express from "express";

const app = express();
app.use(express.json());

app.post("/gsi", (req, res) => {
  console.log("Dados do CS:", req.body);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("GSI listening on port 3000...");
});
