// Importing router
const router = require("express").Router();

// Import all of the API routes
const apiRoutes = require("./api");

// Assign /api to calls made within the /api route folders
router.use("/api", apiRoutes);

router.use((req, res) => {
  res.status(404).send("<h1> 404 Error!</h1>");
});

module.exports = router;
