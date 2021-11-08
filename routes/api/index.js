const router = require("express").Router();

router.use(`/users`, require(`./Users`));
router.use(`/users/auth`, require(`./AuthUsers`));
router.use(`/regions`, require(`./Regions`));
router.use(`/factory`, require(`./Factory`));

module.exports = router;