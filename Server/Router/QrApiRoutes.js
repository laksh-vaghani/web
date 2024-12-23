const express = require('express');
const app = express();
const {
    GetQrCode,
    PostConnectedCode,
    UpdateConnectionNumber,
    UpdateConnectionNumberOnReresh,
    CreaterJoinRoom,
    CreaterLeaveRoom
} = require('../Controller/QrServicesController')

app.get('/qr-code', GetQrCode)
app.post('/connected-code', PostConnectedCode)
app.put('/creater-join', CreaterJoinRoom)
app.put('/new-user', UpdateConnectionNumber)
app.put('/creater-leave', CreaterLeaveRoom)
app.put('/exit-user', UpdateConnectionNumberOnReresh)
module.exports = app