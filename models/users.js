module.exports=(Sequelize,sequelize,DataTypes)=>{
    return sequelize.define("users",{
        ...require("./core")(Sequelize,DataTypes),
        name:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        email:{
            type:DataTypes.STRING(255),
            allowNull:true
        }
    })
}