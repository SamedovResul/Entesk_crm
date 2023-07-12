import { ProfileImage } from "../models/profileImageModel.js";

// Get profile image
export const getProfileImage = async (req, res) => {
  const { id } = req.user;

  try {
    const profileImage = await ProfileImage.find({ userId: id });

    res.status(200).json(profileImage);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  const { id } = req.user;
  const { profileImage } = req.body;

  try {
    const userImage = await ProfileImage.find({ userId: id });
    const buffer = Buffer.from(profileImage, "base64");
    let newProfileImage;
    if (userImage) {
      newProfileImage = await ProfileImage.findByIdAndUpdate(
        userImage._id,
        {
          profileImage: buffer,
        },
        { new: true }
      );
    } else {
      newProfileImage = await ProfileImage.create({
        userId: id,
        profileImage: buffer,
      });
    }

    const base64Image = Buffer.from(newProfileImage.profileImage).toString(
      "base64"
    );

    const objProfileImage = newProfileImage.toObject();

    objProfileImage.profileImage = base64Image;

    res.status(200).json(objProfileImage);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};