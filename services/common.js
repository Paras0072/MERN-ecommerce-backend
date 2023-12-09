const passport =require('passport');

exports.isAuth= (req, res, done) =>{
  return passport.authenticate('jwt');
}
exports.sanitizeUser =(user)=>{
return {id:user.id,role:user.role}

}

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzQwODUyMjQ2NmRjYmU1Yjc1NTk5ZiIsInJvbGUiOiJhZG1pblxuIiwiaWF0IjoxNzAyMTAzMjMxfQ.LY5CQ1behiKOlQHUxJYSbylpLVjxMWMQgGCJtDF268w";
  return token;
};