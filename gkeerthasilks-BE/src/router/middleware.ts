import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
    cb(null, "/uploads/");
  },
  filename: function (req:any, file:any, cb:any) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

export const upload = multer({ storage });
