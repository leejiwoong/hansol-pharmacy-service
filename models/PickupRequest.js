const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PickupRequestSchema = new Schema({
  pharmacy: {
    type: Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  expectedVisitDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['requested', 'scheduled', 'completed', 'cancelled'],
    default: 'requested'
  },
  notes: {
    type: String
  },
  staffAssigned: {
    type: String
  },
  completedDate: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PickupRequest', PickupRequestSchema);
