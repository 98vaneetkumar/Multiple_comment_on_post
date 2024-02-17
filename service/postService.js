const Models=require("../models/index")
const baseService=require("./baseService")
const Response = require("../config/response");

Models.comment.belongsTo(Models.users,{
	foreignKey:"userId"
})

// Models.comment.belongsTo(Models.comment,{
// 	foreignKey:"commentId"
// })

// Define a recursive function to fetch nested comments
async function getNestedComments(commentId) {
	const comments = await Models.comment.findAll({
	  where: { commentId },
	  include: {
		model: Models.comment,
		as: 'replies',
		attributes: ['id', 'comment', 'createdAt'],
		include: getNestedComments // Recursive call for nested comments
	  }
	});
	return comments;
  }

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.posts, objToSave);
};
//save bulk
exports.saveBulkCreate = async (Models, objToSave) => {
	return await baseService.saveBulkData(Models, objToSave);
};
//test
exports.updateData = async (criteria, objToSave) => {
	return await baseService.updateData(Models.posts, criteria, objToSave);
};
//delete data
exports.deleteData = async (ModelsSend, criteria, objToSave) => {
	return await baseService.updateData(ModelsSend, criteria, objToSave);
};
exports.findById = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models.comment
			.findOne({
				where: criteria,
				include:[
					{
						model: Models.users,required:false,
					},
			]
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.findComment = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models.comment
			.findAll({
				where: { postId, commentId: null }, // Top-level comments (not replies)
				include: {
				  model: Models.comment,
				  as: 'replies',
				  attributes: ['id', 'comment', 'createdAt'],
				  include: getNestedComments // Recursive call for nested comments
				}
			})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
