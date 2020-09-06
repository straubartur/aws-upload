const express = require('express')
const campaignPostRoutes = express.Router()
const CampaignsPostController = require('../controllers/CampaignsPostControllers')
const authMiddleware = require('../middlewares/Auth')
campaignPostRoutes.use(authMiddleware)

campaignPostRoutes.get('/', CampaignsPostController.getCampaignsPost);
campaignPostRoutes.get('/:id', CampaignsPostController.getCampaignsPost)
campaignPostRoutes.put('/:id', CampaignsPostController.updateCampaignsPost)
campaignPostRoutes.delete('/:id', CampaignsPostController.deleteCampaignsPost)
campaignPostRoutes.post('/', CampaignsPostController.createCampaignsPost)

module.exports = campaignPostRoutes;