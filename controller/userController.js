const models = require("../models/index");
const Joi=require("joi")
const validation=require("../helper/comman")
const Service=require("../service/index")
const message=require("../config/message");
const bcrypt = require("bcryptjs");
const Response = require("../config/response");
const _ = require("underscore");
const PRIVATE_KEY="#$2dte53267*$&%#fhf";
const Jwt = require("jsonwebtoken");
const reader = require('xlsx');
const fs = require('fs');

const allowedExtensions = ['.xlsx'];
const checkFileExtension = (filename) => {
  const ext = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  return allowedExtensions.includes(`.${ext}`);
};
const processExcelData = (buffer) => {
    const file = reader.read(buffer, { type: 'buffer' });
    let data = [];
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }
    return data;
  };
module.exports={
    registrationUser:async(payloadData,req,res)=>{
        try {
            const schema=Joi.object.keys({
                email:Joi.string().email().required(),
                name:Joi.string().required(),
                password:Joi.string().required()
            })
            let payload=await validation.verifyJoiSchema(payloadData,schema);
            let hashPassword=await bcrypt.hashSync(payload.password, 10);
            let objToFind={
                email:payload.email,
            }
            let checkEmailExist=await Service.userService.getUser(objToFind)
            let objSave={}
            if (_.has(payloadData, "name") && payloadData.name != "") objSave.name = payload.name;
            if (_.has(payloadData, "email") && payloadData.email != "") objSave.email = payload.email;
            if (_.has(payloadData, "password") && payloadData.password != "") objSave.password = payload.hashPassword;
            if(!checkEmailExist) await Service.userService.saveData(models.users,objSave)
            if(checkEmailExist) return Response.error_msg.alreadyExist
        } catch (error) {
            throw error
        }
    },
    login:async(payloadData,req,res)=>{
        try {
            let schema=Joi.object.keys({
                email:Joi.string().required(),
                password:Joi.string().required()
               })
               let payload=await validation.verifyJoiSchema(payloadData,schema)
               let userDetails=await Service.userService.getUser({email:payload.email})
               if(!userDetails) return Response.error_msg.emailAndPasswordNotFound;
               var comparePass = await bcrypt.compare(payload.password, userDetails.password);
               if (!comparePass) throw response.error_msg.passwordNotMatch;
               let tokenData={
                id:userDetails.id,
                email:userDetails.email
               }
               let token=await Jwt.sign(tokenData, PRIVATE_KEY);
               let response = userDetails.dataValues;
               response.token=token
               return response
        } catch (error) {
            throw error
        }
    },
    addposts:async(payloadData,req,res)=>{
        try {
            let schema=Joi.object.keys({
                posts:Joi.string(),
            })
            let payload=await validation.verifyJoiSchema(payloadData,schema);
            let objToSave={
                posts:payload.posts
            }
            await Service.postService.saveData(objToSave)
            return message.success.ADDED;
        } catch (error) {
            throw error
        }
    },
    addComment:async(payloadData,req,res)=>{
        try {
           let schema=Joi.object.keys({
            comment:Joi.string().required(),
            postsId:Joi.string().required(),
            commentId:Joi.string()
           }) 
           let payload=await validation.verifyJoiSchema(payloadData,schema)
           let objToSave={
            comment:payload.comment,
            postsId:payload.postsId,
            commentId:payload.commentId,
            userId:req.credentials.id
           }
           await Service.postService.saveData(objToSave)
           return message.success.ADDED
        } catch (error) {
            throw error
        }
    },
    findOuterComments:async(payload,req,res)=>{
        try {
            let schema=Joi.object.keys({
               postId:Joi.string().required(),
            })
            let payload=await validation.verifyJoiSchema(payloadData,schema)
            let data = await Service.postService.findById({postId:payload.postId,commentId:null})
            return data;
        } catch (error) {
            throw error
        }
    },
    findInnerComments:async(payload,req,res)=>{
        try {
            let schema=Joi.object.keys({
                postsId:Joi.string().required(),
            })
            let payload=await validation.verifyJoiSchema(payload,schema)
            let respone=await Service.postService.findComment(payload)
            return respone;
        } catch (error) {
            throw error
        }
    },
    readExcel:async(payloadData,req,res)=>{
        try {
          console.log("req.files", req.files);
          if (!req.files || !req.files.thumbnail) {
            return res.status(400).send('No file uploaded.');
          }
          const uploadedFile = req.files.image;
        if (!checkFileExtension(uploadedFile.name)) {
        return res.status(400).json({ error: 'Invalid file extension. Only .xlsx files are allowed.' });
        }
          const fileBuffer = req.files.thumbnail.data;
          const data = processExcelData(fileBuffer);
          console.log("data", data);

          // return res.status(200).send(data);
        } catch (error) {
          console.error(error);
          return res.status(500).send('Internal Server Error.');
        }
      }
}