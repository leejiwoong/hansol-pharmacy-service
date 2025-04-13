const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrescriptionBoxSchema = new Schema({
  boxId: {
    type: String,
    required: true,
    unique: true
  },
  pharmacy: {
    type: Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'destroyed'],
    default: 'active'
  },
  location: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PrescriptionBox', PrescriptionBoxSchema);
