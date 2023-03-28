import Tour from "../models/tour.model.js";

const addTour = async (req, res) => {
  const {
    role,
    location,
    companyName,
    stipend,
    category,
    batch,
    description,
    link,
  } = req.body;
  if (
    !role ||
    !companyName ||
    !batch ||
    !location ||
    !description ||
    !category ||
    !link ||
    stipend < 1
  ) {
    res.status(400).json({ message: "Please Provide valid details" });
    // throw new Error("Please provide valid details");
  }
  const imageBuffer = req.files?.[0]?.buffer ? req.files?.[0]?.buffer : null;

  const tour = new Tour({
    role,
    location,
    companyName,
    stipend,
    batch,
    description,
    category,
    link,
    image: imageBuffer,
  });
  await tour.save();

  res.status(201).json({ tour, message: "Tour created successfully" });
};

const getAllTours = async (req, res) => {
  const tours = await Tour.find().sort({ createdAt: -1 });
  const finalTours = tours.map((tour) => {
    if (tour.image) {
      let buffer = Buffer.from(tour.image);
      let base64Image = buffer.toString("base64");

      const {
        _id,
        role,
        location,
        companyName,
        stipend,
        batch,
        description,
        category,
        link,
      } = tour;

      return {
        image: base64Image,
        _id,
        role,
        location,
        companyName,
        stipend,
        batch,
        category,
        description,
        link,
      };
    } else {
      return tour;
    }
  });
  res
    .status(201)
    .json({ tours: finalTours, message: "Fetched Tours Successfully" });
};

const getTourById = async (req, res) => {
  const _id = req.params.id;
  const tour = await Tour.find({ _id });
  res.status(200).json({ tour, message: "Fetched Tour Successfully" });
};

const deleteTourById = async (req, res) => {
  const _id = req.params.id;
  await Tour.deleteOne({ _id });
  res.status(200).json({ message: "Tour Deleted Successfully" });
};

const deleteAllTours = async (req, res) => {
  await Tour.deleteMany();
  res.status(200).json({ message: "Tours Deleted Successfully" });
};
const searchTours = async (req, res) => {
  let searchedTours = await Tour.find({
    $or: [
      {
        role: { $regex: req.params.key },
      },
      { companyName: { $regex: req.params.key } },
      { batch: { $regex: req.params.key } },
      { location: { $regex: req.params.key } },
    ],
  });
  const finalTours = searchedTours.map((tour) => {
    if (job.image) {
      let buffer = Buffer.from(tour.image);
      let base64Image = buffer.toString("base64");

      const {
        _id,
        role,
        location,
        companyName,
        stipend,
        batch,
        category,
        description,
        link,
      } = tour;

      return {
        image: base64Image,
        _id,
        role,
        location,
        companyName,
        stipend,
        category,
        batch,
        description,
        link,
      };
    } else {
      return tour;
    }
  });

  res
    .status(200)
    .json({ tour: finalTours, message: "Tours Searched Successfully" });
};

export {
  addTour,
  getAllTours,
  getTourById,
  deleteTourById,
  deleteAllTours,
  searchTours,
};
