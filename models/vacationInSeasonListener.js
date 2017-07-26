const mongoose = require('mongoose');
const vacationSeasonListenerSchema = mongoose.Schema({
  email: String,
  skus: [String]
});
const VacationInSeasonListener = mongoose.model('VacatonInSeasonListener', vacationSeasonListenerSchema);

module.exports = VacationInSeasonListener;