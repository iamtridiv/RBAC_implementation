const { render } = require('ejs')
const router = require('express').Router();

/*router.get('/profile', async (req, res, next) => {
  // console.log(req.user);
  const person = req.user;
  res.render('profile');
});*/

router.get("/profile", async (req, res, next) => {
    //res.send("Login");
    const person = req.user
    res.render('profile', {person});
});

module.exports = router;