const QrCode = require('qrcode')
const Connection = require('../Modules/UserConnection')
const QrCodes = require('../Modules/QrCreater')

const GetQrCode = async (req, res) => {
  try {
    await QrCodes.deleteMany({ userConnected: 0, roomCreater: false });

    let code;
    let existingQrCode;

    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      existingQrCode = await QrCodes.findOne({ code: code });
    } while (existingQrCode);

    const URL = `http://localhost:3000/show-case?code=${code}`;
    const qrCodeImage = await QrCode.toDataURL(URL);

    const newQrCode = new QrCodes({ code: code, userConnected: 0, roomCreater: false });
    await newQrCode.save();

    res.status(200).json({ code, qrCodeImage });

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Internal Server Error');
  }
};



const PostConnectedCode = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "Code query parameter is required" });
    }

    const isConnected = true;
    const newConnection = new Connection({ code: code, connectionStatus: isConnected });
    await newConnection.save();

    console.log("Connection saved:", isConnected);

    return res.status(200).json({ message: "Code received successfully", code });
  } catch (error) {
    console.error("Error handling PostConnectedCode:", error);
    return res.status(500).send("Internal Server Error");
  }
};



const UpdateConnectionNumber = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "Code query parameter is required" });
    }
    const updatedQrCode = await QrCodes.findOneAndUpdate(
      { code: code },
      { $inc: { userConnected: 1 } },
    );

    if (!updatedQrCode) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.status(200).json({ message: "User connected number updated successfully", userConnected: updatedQrCode.userConnected });
  } catch (error) {
    console.error("Error updating connection number:", error);
    res.status(500).send("Internal Server Error");
  }
};


const UpdateConnectionNumberOnReresh = async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).json({ error: "Code query parameter is required" });
    }

    const updatedQrCode = await QrCodes.findOneAndUpdate(
      { code: code },
      { $inc: { userConnected: -1 } },
      { new: true, runValidators: true }
    );

    if (!updatedQrCode) {
      return res.status(404).json({ error: "Code not found" });
    }

    if (updatedQrCode.userConnected < 0) {
      return res.status(400).json({
        error: "Cannot decrement. User connected is already at 0 or lower.",
      });
    }

    res.status(200).json({
      message: "User connected number decremented successfully",
      userConnected: updatedQrCode.userConnected
    });
  } catch (error) {
    console.error("Error decrementing connection number:", error);
    res.status(500).send("Internal Server Error");
  }
};


const CreaterJoinRoom = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "Code query parameter is required" });
    }

    const updateCreater = await QrCodes.findOneAndUpdate(
      { code: code },
      { roomCreater: true },
      { new: true }
    );

    if (!updateCreater) {
      return res.status(404).json({ error: "Code not found" });
    }

    return res.status(200).json({
      message: "Creater connected successfully",
      roomCreater: updateCreater.roomCreater,
    });
  } catch (error) {
    console.error("Error connecting creator:", error);
    return res.status(500).send("Internal Server Error");
  }
};



const CreaterLeaveRoom = async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).json({ error: "Code query parameter is required" });
    }

    const updateCreater = await QrCodes.findOneAndUpdate(
      { code: code },
      { roomCreater: false },
      { new: true }
    );

    if (!updateCreater) {
      return res.status(404).json({ error: "Code not found" });
    }

    return res.status(200).json({
      message: "Creater Leave Room successfully",
      roomCreater: updateCreater.roomCreater,
    });
  } catch (error) {
    console.error("Error Leave Room:", error);
    return res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  GetQrCode,
  PostConnectedCode,
  UpdateConnectionNumber,
  UpdateConnectionNumberOnReresh,
  CreaterJoinRoom,
  CreaterLeaveRoom
}