const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const UserModel = require('./userSchema')


//middleware
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Connecting MongoDB with mongoose
mongoose.connect('mongodb://localhost:27017/test')
  .then(() => 
    console.log({message: 'connected to mongo'})
).catch((err) => console.error('connection failed..', err))


//creating and saving new document
async function createUser(){
    const user = new UserModel({
        Lastname : 'Siena',
        Firstname : 'Tine',
        Gender : 'Male',
        Birthday: new Date ('2002-12-21'),
        Age: 21
    })
    const result = await user.save();
    console.log(result);
}
createUser();

//querying documents
async function  getUsers (){
    
    //--QUERYING DOCUMENTS
    const users = await UserModel.find({ Lastname : 'Tolentino', Gender: 'Male'})
    .limit(10)
    .sort({ Firstname : 1})
    .select({Firstname : 1, Lastname: 1})
    console.log(users)
    /*
    --COMPARISON QUERY
    const users = await UserModel.find({
        Lastname : { $eq: 'Doe'},
        Gender: { $eq: 'Female'},
        Birthday: { $gte: new Date('1990-01-01'), $lte: new Date('1990-12-31')},
        })
        .limit(10)
        .sort({ Firstname : 1})
        .select({Firstname : 1, Lastname: 1})
        console.log(users)

    --LOGICAL QUERY
    const users = await UserModel.find({
        $and: [
            {Lastname: 'Doe'},
            {Gender : 'Female'},
            {
                $and: [
                    { Birthday: { $gte: new Date('1998-01-01')}},
                    { Birthday: { $gte: new Date('1999-12-13')}}
                ]
            }
        ]
    })
    .limit(10)
        .sort({ Firstname : 1})
        .select({Firstname : 1, Lastname: 1})
        console.log(users)

    --REGULAR EXPRESSION
    const users = await UserModel.find({
        Lastname : /Tolentino/i,
        Gender: /Male/i,
    })
    .limit(10)
    .sort({ Firstname : 1})
    .select({Firstname : 1, Lastname: 1})

    const regex = /^T/i;
    const filteredUsers = users.filter((user) => regex.test(user.Lastname));
    console.log(filteredUsers)*/
}
getUsers()

//UPDATING A DOCUMENT QUERY FIRST
async function updateUser(query, update) {
    const user = await UserModel.findOne(query);
    if (user) {
        user.Firstname = update.$set.Firstname;
        user.Gender = update.$set.Gender;
        const result = await user.save();
    }
}
const query = { Lastname: /Tolentino/i, Firstname: /Timothy/i};
const update = { $set: {Firstname: "Janna", Gender: 'Female'}};
updateUser(query,update)

//REMOVING DOCUMENTS
async function deleteData(query){
    try {
        const result = await UserModel.deleteOne(query)
        console.log(`deleted data: ${result}`)
    } catch (err) {
        console.log(`error deleting data : ${err}`)
    }
}

//REMOVING DOCUMENTS - DELETEOne
async function deleteData(query){
    try{
        const result = await UserModel.deleteOne(query);
        console.log(`Deleted data: ${result}`)
    }catch (err){
        console.error(`Error deleting data: ${err}`)
    }
}

//REMOVING DOCUMENTS -DELETEMany
async function deleteAllData(){
    const result = await UserModel.deleteMany();
    console.log(result)
}

/*REMOVING DOCUMENTS - Find by Id and delete
const deleteData = async (id) => {
    try{
        const result = await UserModel.findByIDAndDelete(id);
        console.log(`Deleted data: ${result}`)
    }catch (err) {
        console.error(`Error deleting data: ${err}`)
    }
}

//usage example
const idToDelete = 'Id to delete';
deleteData(idToDelete);*/


//setting-up the port
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`listening to port: ${port}`)
})
