const { Router } = require("express");
const router = Router();
const {
  userInfo,
  getInfo,
  getOneInfo,
  deleteUser,
  userUpdate,
  AuthorizingRoute,
  authorizeNumber

} = require('../controllers/UserApi');
const { register, login, AuthorizingRouteAdmin,authorizeAdmin } = require('../controllers/AdminApi');

router.route("/createUser").post(AuthorizingRouteAdmin,authorizeAdmin("admin"),userInfo);
router.route("/allinfo").get(AuthorizingRoute,authorizeAdmin("admin") ,getInfo);
router.route("/oneinfo/:id").get(AuthorizingRoute,authorizeNumber("user"), getOneInfo )

router.route("/userUpdate/:id").put(AuthorizingRoute,authorizeNumber("user") , userUpdate);
router.route("/delete/:id").delete( AuthorizingRoute,authorizeNumber("user") ,deleteUser);
router.route("/register").post(  register);
router.route("/login").post(login);

module.exports = router
