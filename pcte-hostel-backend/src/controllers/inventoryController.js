import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getInventoryChecklist(req, res, next) {
  try {
    const store = getStore();
    return res.status(200).json({ success: true, data: store.inventoryChecklist || [] });
  } catch (err) {
    next(err);
  }
}

export async function verifyInventoryItem(req, res, next) {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const store = getStore();
    const item = store.inventoryChecklist.find((i) => i.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Inventory item not found" });
    }

    item.verified = Boolean(verified);
    saveStore();

    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
