const counter = require('./admin/counterController');
const office = require('./admin/officeController');
const service = require('./admin/serviceController');
const priority = require('./admin/priorityController');
const gender = require('./admin/genderController');
const officeUser = require('./admin/officeUserController');
const agentUser = require('./admin/agentUserController');
const queueService = require('./admin/queueServiceController');
const WTnewsList = require('./admin/WTnewsController');
const WTvideo = require('./admin/WTvideoController');
const country = require('./admin/countryController');

module.exports = {
    // Counter
    counterList: counter.counterList,
    counterCreate: counter.counterCreate,
    counterUpdate: counter.counterUpdate,
    counterDelete: counter.counterDelete,
    // Office
    officeList: office.officeList,
    officeCreate: office.officeCreate,
    officeUpdate: office.officeUpdate,
    officeDelete: office.officeDelete,
    // Service
    serviceList: service.serviceList,
    serviceCreate: service.serviceCreate,
    serviceUpdate: service.serviceUpdate,
    serviceDelete: service.serviceDelete,
    // Priority
    priorityList: priority.priorityList,
    priorityCreate: priority.priorityCreate,
    priorityUpdate: priority.priorityUpdate,
    priorityDelete: priority.priorityDelete,
    // Gender
    genderList: gender.genderList,
    genderCreate: gender.genderCreate,
    genderUpdate: gender.genderUpdate,
    genderDelete: gender.genderDelete,
    // Office User
    officeUserList: officeUser.officeUserList,
    officeUserCreate: officeUser.officeUserCreate,
    officeUserUpdate: officeUser.officeUserUpdate,
    officeUserDelete: officeUser.officeUserDelete,
    // Agent User
    agentUserList: agentUser.agentUserList,
    agentUserCreate: agentUser.agentUserCreate,
    agentUserUpdate: agentUser.agentUserUpdate,
    agentUserDelete: agentUser.agentUserDelete,
    // Queue Service
    queueServiceList: queueService.queueServiceList,
    queueServiceListById: queueService.queueServiceListById,
    queueServiceCreate: queueService.queueServiceCreate,
    queueServiceUpdate: queueService.queueServiceUpdate,
    queueServiceDelete: queueService.queueServiceDelete,
    // WT News
    WTnewsList: WTnewsList.WTnewsList,
    WTnewsCreate: WTnewsList.WTnewsCreate,
    WTnewsUpdate: WTnewsList.WTnewsUpdate,
    WTnewsDelete: WTnewsList.WTnewsDelete,
    // WT Video
    WTvideoList: WTvideo.WTvideoList,
    WTvideoCreate: WTvideo.WTvideoCreate,
    WTvideoUpdate: WTvideo.WTvideoUpdate,
    WTvideoDelete: WTvideo.WTvideoDelete,
    // Country
    countryList: country.countryList,
    countryCreate: country.countryCreate,
    countryUpdate: country.countryUpdate,
    countryDelete: country.countryDelete,
};