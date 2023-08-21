const bcrypt = require('bcryptjs')
export const GenerateHashedPassword = async(candidatePassword:string):Promise<string>=>{
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(candidatePassword, salt);
    return hash
}

export const ComparePassword = async({candidatePassword,hashedPassword}:{candidatePassword:string,hashedPassword:string}):Promise<boolean>=>{
    return await bcrypt.compareSync(candidatePassword, hashedPassword);
}