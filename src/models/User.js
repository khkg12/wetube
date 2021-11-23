import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique는 같은 email과 username이 존재할 수 없도록 제어해줌
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5); // create과정에서 입력받은 password값이 this.password, 저장되기 전에 먼저 거치는 함수, 5는 saltRounds로 몇번 hash할지 정하는 것
});

const User = mongoose.model("User", userSchema);

export default User;
