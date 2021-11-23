export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn); // Boolean함수를 이용하여 괄호안의 값이 true인지 false인지 확인
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  next(); // next()를 작성해주지 않으면 오류발생, 이유는 다음 함수로 넘어가지 못하기 때문
};
