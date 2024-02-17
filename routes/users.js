var express = require('express');
var router = express.Router();
const Controller=require("../controller/index")
const sendResponse=require("../config/sendResponse")
const authentication=require("../middleWares/userAuthentication").verifyToken;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/addUser", (req, res) => {
	return sendResponse.executeMethod(Controller.userController.registrationUser, req.body, req, res);
});

router.post("/login",(req,res)=>{
  return sendResponse.executeMethod(Controller.userController.login,req.body,req,res);
})

router.post("/addPosts",authentication,(req, res) => {
	return sendResponse.executeMethod(Controller.userController.addposts, req.body, req, res);
});

router.post("/addComment", authentication,(req, res) => {
	return sendResponse.executeMethod(Controller.userController.addComment, req.body, req, res);
});

router.get("/findOuterComments",authentication, (req, res) => {
  let payload = req.body;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controller.userController.findOuterComments, req.body, req, res);
});

router.get("/findInnerComments",authentication, (req, res) => {
  let payload = req.body;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controller.userController.findInnerComments, req.body, req, res);
});


router.post("/readExcelFileData",authentication,(req, res) => {
	let payload = req.body;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(Controller.userController.readExcel, req.body, req, res);
});

module.exports = router;
