const router = require('express').Router();
const db = require('../models');
const bcrypt = require('bcrypt');

const {User} = db;

router.get('/profile', async (req,res) => {
    // console.log(req.session.userId)
    try {
        let user = await User.findOne({
            where:{
                userId: req.session.userId,
            }
        })
        res.json(user)
    }catch(err){
        res.json(null)
    }
})

router.post('/', async (req, res) => {
    const user = await User.findOne({
        where: {email: req.body.email}
    });

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)){
        res.status(404).json({
            message: 'Could not find a user with the provided username and password'
        })
    } else {
        req.session.userId = user.userId
        res.json({user})
    }

});


module.exports = router