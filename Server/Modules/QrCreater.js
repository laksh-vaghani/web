const { default: mongoose } = require("mongoose");

const QrCodesSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    userConnected: {
        type: Number,
        default: 0
    },
    roomCreater: {
        type: 'boolean',
    }
})
const QrCodes = mongoose.model('QrCodes', QrCodesSchema);
module.exports = QrCodes;