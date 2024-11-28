class userSchema {
    constructor(email, password, name){
        this.email = email
        this.password = password
        this.name = name
    }
    toJSON() {
        return {
            email: this.email,
            password: this.password,
            name: this.name
        };
    }
}

module.exports = userSchema