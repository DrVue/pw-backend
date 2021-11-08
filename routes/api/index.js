const router = require("express").Router();

router.use(`/users`, require(`./Users`));
router.use(`/users/auth`, require(`./AuthUsers`));
router.use(`/regions`, require(`./Regions`));

module.exports = router;