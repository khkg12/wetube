export const trending = (req, res) => res.render("home", { pageTitle: "Home" }); //첫번째 인자는 view의 이름, 두번째인자는 view파일에 보낼 변수 // home.pug를 렌더링 따로 views폴더를 import안해줘도 되는 이유는 express자체가 views폴더에서 렌더링할 파일을 찾도록 설계되어있기 때문
export const see = (req, res) => res.render("watch"); //view파일명을 지을 때 Watch이런 식으로 짓지말고 전부 소문자를 사용할것
export const edit = (req, res) => {
  console.log(req.params);
  return res.send("edit");
};
export const search = (req, res) => res.send("search");
export const uproad = (req, res) => res.send("uproad");
export const remove = (req, res) => {
  console.log(req.params);
  res.send("remove");
};
