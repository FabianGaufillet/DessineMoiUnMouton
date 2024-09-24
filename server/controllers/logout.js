const logout = (req, res) => {
  res.clearCookie("DMUM-token", { httpOnly: true });
  res.clearCookie("DMUM-authenticated");
  return res.status(200).json({
    status: "success",
    data: [],
    message: "Vous êtes désormais déconnecté.",
  });
};

export { logout };
