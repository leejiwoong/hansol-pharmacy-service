const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrescriptionSearchRequestSchema = new Schema({
  pharmacy: {
    type: Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientId: {
    type: String,
    required: true
  },
  prescriptionDate: {
    type: Date
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['requested', 'processing', 'completed', 'not_found'],
    default: 'requested'
  },
  staffAssigned: {
    type: String
  },
  prescriptionImage: {
    type: String
  },
  responseDate: {
    type: Date
  },
  notes: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PrescriptionSearchRequest', PrescriptionSearchRequestSchema);
