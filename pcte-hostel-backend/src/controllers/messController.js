import MessMenu from "../models/MessMenu.js";
import { isMongoConnected } from "../config/db.js";
import { getStore, saveStore } from "../utils/storeFallback.js";

export async function getMessMenu(req, res, next) {
  try {
    if (isMongoConnected()) {
      const items = await MessMenu.find().lean();
      if (items.length > 0) {
        const menuObj = {};
        items.forEach((item) => {
          menuObj[item.day] = {
            breakfast: item.breakfast,
            lunch: item.lunch,
            snacks: item.snacks,
            dinner: item.dinner,
          };
        });
        return res.status(200).json({ success: true, data: menuObj });
      }
    }

    const store = getStore();
    return res.status(200).json({ success: true, data: store.messMenu });
  } catch (err) {
    next(err);
  }
}

export async function updateMessMenu(req, res, next) {
  try {
    const { day, breakfast, lunch, snacks, dinner } = req.body;

    if (!day) {
      return res.status(400).json({ success: false, message: "Day is required" });
    }

    if (isMongoConnected()) {
      const updated = await MessMenu.findOneAndUpdate(
        { day },
        { breakfast, lunch, snacks, dinner },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, data: updated });
    } else {
      const store = getStore();
      store.messMenu[day] = { breakfast, lunch, snacks, dinner };
      saveStore();
      return res.status(200).json({ success: true, data: store.messMenu[day] });
    }
  } catch (err) {
    next(err);
  }
}

export async function getMealSkips(req, res, next) {
  try {
    const { collegeId } = req.params;
    const store = getStore();
    const skips = (store.mealSkips && store.mealSkips[collegeId]) || [];
    return res.status(200).json({ success: true, data: skips });
  } catch (err) {
    next(err);
  }
}

export async function toggleMealSkip(req, res, next) {
  try {
    const { collegeId, mealKey } = req.body;
    if (!collegeId || !mealKey) {
      return res.status(400).json({ success: false, message: "collegeId and mealKey are required" });
    }

    const store = getStore();
    if (!store.mealSkips) store.mealSkips = {};
    const studentSkips = store.mealSkips[collegeId] || [];

    const alreadySkipped = studentSkips.includes(mealKey);
    const nextSkips = alreadySkipped
      ? studentSkips.filter((m) => m !== mealKey)
      : [...studentSkips, mealKey];

    store.mealSkips[collegeId] = nextSkips;
    saveStore();

    return res.status(200).json({
      success: true,
      data: nextSkips,
      skipped: !alreadySkipped,
    });
  } catch (err) {
    next(err);
  }
}
