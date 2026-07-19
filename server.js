const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==================================");
  console.log(`🚀 AiTradeX Server Running`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("==================================");
});