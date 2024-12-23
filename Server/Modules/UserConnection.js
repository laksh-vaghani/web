const { default: mongoose } = require("mongoose");

const successSchema = new mongoose.Schema({
    code:{
        type: 'string',
    },
    success:{
        type: 'boolean',    
    }
})
const Success = mongoose.model('successes', successSchema);
module.exports = Success;