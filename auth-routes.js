const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const MyUser = require('./user');

const checkAuth = require('./check-auth')

// Signup API
router.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.json({ success: false, message: "Email and Password Required !" })
    } else {

      const user = new MyUser({
        displayName: req.body.displayName,
        email: req.body.email,
        password: hash,
        dob: req.body.dob,
        phone: req.body.phone,
        work: req.body.work,
        address: req.body.address
      })

      user.save()
        .then((_) => {
          res.json({ success: true, message: "Account Has Been Created" })
        }).catch((err) => {
          //E11000 duplicate key error collection
          if (err.code === 11000) {
            return res.json({ success: false, message: "Email Already Exist !" })
          }
          res.json({ success: false, message: "Authentication Failed !!" })
        })
    }
  });


}
)

// Login API
router.post('/login', (req, res) => {
  MyUser.find({ email: req.body.email }).exec().then((result) => {
    if (result.length < 1) {
      return res.json({ success: false, message: "User Not Found !!" })
    }
    const user = result[0];
    bcrypt.compare(req.body.password, user.password, (err, res) => { })
    if (res) {
      const payload = {
        userId: user._id
      }
      const token = jwt.sign(payload, "webBatch")
      return res.json({ success: true, token: token, message: "Login Successful" })
    } else {
      return res.json({ success: false, message: "Password Does not match" })
    }
  });
})

// Get Profile API
router.get('/profile', checkAuth, (req, res) => {
  const userId = req.userData.userId;
  MyUser.findById(userId).exec().then((result) => {
    res.json({ success: true, data: result })
  }).catch(err => {
    res.json({ success: false, message: "Server Error" })
  })
})
// PUT API - Update data
router.put('/editProfile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = await MyUser.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;