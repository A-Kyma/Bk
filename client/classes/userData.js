import {User} from "../../lib/classes/user";

let UsersDataCollection = new Mongo.Collection('usersData')
const UserData = User.inherit({
  name: "UserData",
  collection: UsersDataCollection
})

export default UserData