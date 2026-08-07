const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    companyName: user.companyName, // 👈 ADDED: Sends company name
    designation: user.designation, // 👈 ADDED: Sends designation
    resumeUrl: user.resumeUrl,
    resumeText: user.resumeText,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user: safeUser,
    token,
  });
};

module.exports = sendToken;