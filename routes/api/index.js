const router = require("express").Router();

router.use(`/users`, require(`./Users`));
router.use(`/users/auth`, require(`./AuthUsers`));
router.use(`/regions`, require(`./Regions`));
router.use(`/factory`, require(`./Factory`));
router.use(`/chats`, require(`./Chats`));
router.use(`/mail`, require(`./Mail`));
router.use(`/articles`, require(`./Articles`));

module.exports = router;