import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { email, username, password, name, location } = req.body;
  await User.create({
    email,
    username,
    password,
    name,
    location,
  });
  return res.redirect("/login");
};
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("delete User");
export const login = (req, res) => res.send("User login");
export const logout = (req, res) => res.send("User logout");
export const see = (req, res) => res.send("see user");
