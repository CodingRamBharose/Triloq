import mongoose from 'mongoose';
const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members:[
    {
        type: mongoose.Schema.Types.ObjectId, ref:"Users", required: true
    }
  ],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  messages:[
    {
        type: mongoose.Schema.Types.ObjectId, ref:"Messages", required: false
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ChannelSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Channel = mongoose.model('Channel', ChannelSchema);
export default Channel;