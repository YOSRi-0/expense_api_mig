import mongoose from 'mongoose'

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      enum: ['expense', 'income'],
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
)

listSchema.index({ createdBy: 1, name: 1 }, { unique: true })

export const List = mongoose.model('list', listSchema)
