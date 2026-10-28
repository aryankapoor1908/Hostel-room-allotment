import Marketplace from "../models/Marketplace.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getMarketplaceItems(req, res, next) {
  try {
    const { category } = req.query;

    if (isMongoConnected()) {
      const filter = category ? { category } : {};
      const items = await Marketplace.find(filter).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, data: items });
    } else {
      const store = getStore();
      let list = [...store.marketplace];
      if (category) list = list.filter((i) => i.category === category);
      return res.status(200).json({ success: true, data: list });
    }
  } catch (err) {
    next(err);
  }
}

export async function createMarketplaceItem(req, res, next) {
  try {
    const itemData = req.body;
    const newItem = {
      id: "mkt_" + Date.now(),
      ...itemData,
    };

    if (isMongoConnected()) {
      const created = await Marketplace.create(newItem);
      return res.status(201).json({ success: true, data: created });
    } else {
      const store = getStore();
      store.marketplace.unshift(newItem);
      saveStore();
      return res.status(201).json({ success: true, data: newItem });
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteMarketplaceItem(req, res, next) {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await Marketplace.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }
      return res.status(200).json({ success: true, message: "Item removed" });
    } else {
      const store = getStore();
      const index = store.marketplace.findIndex((i) => i.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }
      store.marketplace.splice(index, 1);
      saveStore();
      return res.status(200).json({ success: true, message: "Item removed" });
    }
  } catch (err) {
    next(err);
  }
}
