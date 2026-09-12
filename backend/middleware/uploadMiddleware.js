import multer from "multer";

const storage = multer.memoryStorage();

const allowedExtensions = [".xlsx", ".xls", ".csv"];

const fileFilter = (req, file, cb) => {
  const name = file.originalname.toLowerCase();
  const isAllowed = allowedExtensions.some((ext) => name.endsWith(ext));

  if (!isAllowed) {
    return cb(
      new Error("Only .xlsx, .xls or .csv files are allowed."),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
});

export default upload;
