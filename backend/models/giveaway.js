import { Schema, model } from "mongoose";

const GiveawaySchema = new Schema({
  name: { type: String, required: true }, // Name of the giveaway item
  imageLink: { type: String, required: true }, // Link to the header image
  storeLink: { type: String, required: true }, // Link to the store page of the item
  cdkey: { type: String, required: true }, // CD key of the item to be collected (will be encrypted before saving)
  collected: { type: Boolean, default: false }, // Flag to indicate if the item has been collected
});

const Giveaway = model("Giveaway", GiveawaySchema);

export default Giveaway;
