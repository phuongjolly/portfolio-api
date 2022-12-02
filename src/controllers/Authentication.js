const bcrypt = require("bcrypt");
const User = require("../models/User");

class Authentication {
    async createUser(data) {
        const encriptPassword = await bcrypt.hash(data.password, 10);
        const newUser = new User({...data, password: encriptPassword});
        return await newUser.save();
    }

    async login(data) {
        
        const user = await User.findOne({username: data.username}).exec();
        if (user) {
            const result = await bcrypt.compare(data.password, user.password);
            return result;
        }

        return null;
    }
}

module.exports = new Authentication();