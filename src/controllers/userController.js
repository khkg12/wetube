import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch"; // npm i node-fetch 명령어를 통해 브라우저에서만 사용가능하던 fetch 기능을 nodejs에서 사용가능

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { email, username, password, password2, name, location } = req.body;
  const exists = await User.exists({ $or: [{ username }, { email }] }); // username: username을 줄여서 사용, $or은 조건들중 한개가 true이면 해당
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  if (exists) {
    return res.status(400).render("join", {
      // status(400)가 필요한 이유 : 노마드코더 7.4강의 6:10
      pageTitle,
      errorMessage: "This Username/email is aleady taken.",
    });
  }
  try {
    await User.create({
      email,
      username,
      password,
      name,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username }); // username:username 즉, 동일한 username을 가진 user를 찾음
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists",
    });
  }
  const ok = await bcrypt.compare(password, user.password); // user.password, db의 password와 req.body로 가져온 password값을 해쉬하여 비교해줌
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password!",
    });
  }
  req.session.loggedIn = true; // 아래와 같이
  req.session.user = user; // 이 부분이 세션이 수정되는 곳
  res.redirect("/");
};

export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("delete User");
export const logout = (req, res) => res.send("User logout");
export const see = (req, res) => res.send("see user");

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT, // github이 요구하는 값그대로 client_id라고 써줘야함.
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString(); // 위의 값을 url형식으로 변경해주는 것.
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const data = await fetch(finalUrl, {
    // fetch를 사용해줌으로서 finalUrl에 post요청하는 코드
    method: "POST",
    header: {
      // header는 그저 백엔드 서버에 요청 또는 응답으로 부가적인 정보를 전송하는 역할
      Accept: "application/json", // json을 받기 위한 깃헙의 요구사항
    },
  });
  const json = await data.json();
  res.send(JSON.stringify(json));
};
