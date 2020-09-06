const express = require('express')
const campaignRoutes = express.Router()
const CampaignsController = require('../controllers/CampaignsControllers')
const authMiddleware = require('../middlewares/Auth')
campaignRoutes.use(authMiddleware)

campaignRoutes.get('/', CampaignsController.getCampaigns);
campaignRoutes.get('/:id', CampaignsController.getCampaigns)
campaignRoutes.put('/:id', CampaignsController.updateCampaigns)
campaignRoutes.delete('/:id', CampaignsController.deleteCampaigns)
campaignRoutes.post('/', CampaignsController.createCampaigns)

module.exports = campaignRoutes;