const logoutController = {};

logoutController.logout = (req, res) => {
    res.clearCookie("authToken");

   return res.json({ message: "Sesión cerrada" });
}

export default logoutController;