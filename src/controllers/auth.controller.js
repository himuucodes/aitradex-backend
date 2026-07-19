const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {

        const body = req.body;

        const exists = await User.findOne({
            email: body.email,
        });

        if (exists) {
            return res.status(400).json({
                success:false,
                message:"Email already exists"
            });
        }

        const hashed = await bcrypt.hash(body.mpin,10);

        const user = await User.create({

            ...body,

            mpin: hashed,

            panImage: body.panImageUrl,
            aadhaarFrontImage: body.aadhaarFrontUrl,
            aadhaarBackImage: body.aadhaarBackUrl,
            selfieImage: body.selfieUrl,
            signatureImage: body.signatureUrl,

        });

        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET
        );

        return res.status(201).json({

            success:true,

            token,

            user

        });

    } catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }
};