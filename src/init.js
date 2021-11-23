// init.js은 필요한 모든것들을 import시키는 역할을 담당, 시작부분, 서버의 시작부분과 서버가 시작하기 전 필요한 db등을 import시키는 역할
import "dotenv/config";
import "./db"; // 나의 서버가 mongo에 연결될 수 있게 db자체를 import
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
