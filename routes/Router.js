const { Router } = require("express");
const router = Router();
const {
  userInfo,
  getInfo,
  getOneInfo,
  deleteUser,
  userUpdate,
} = require('../controllers/UserApi');
const { register, login, AuthorizingRoute,authorizeAdmin } = require('../controllers/AdminApi');

router.route("/createUser").post(AuthorizingRoute,authorizeAdmin("admin","user"),userInfo);
router.route("/allinfo").get(AuthorizingRoute,authorizeAdmin("admin","user") ,getInfo);
router.route("/oneinfo/:id").get(AuthorizingRoute,authorizeAdmin("admin","user"), getOneInfo )

router.route("/userUpdate/:id").put(AuthorizingRoute,authorizeAdmin("admin","user") , userUpdate);
router.route("/delete/:id").delete( AuthorizingRoute,authorizeAdmin("admin") ,deleteUser);
router.route("/register").post(  register);
router.route("/login").post(login);

module.exports = router
