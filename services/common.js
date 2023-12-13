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
//  token =
 //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Nzk4ZmEwNTAyODY5OTZmMThjZmI3ZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAyNDY1NDQwfQ.sxIKog4SPPt6Ik5joXJZxhh4jujS8eiYqLvMv52qOSg; connect.sid=s%3A6OHzQZ6UdNAbIOhS1toalpIahvTsX5P2.OMyoaVqmGaMWzdnbenumXQbLYF%2B7%2B7ri2GImh0oZT4Y";
  return token;
};