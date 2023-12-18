const Item = require("../Models/MenuModel")
const Menu = require("../DATA/Data")

const fetch = async ()=>{
    await Item.deleteMany({})
    await Item.insertMany(Menu)
}
fetch()
module.exports=fetch