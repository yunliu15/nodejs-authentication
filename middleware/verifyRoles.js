const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        console.log(req.roles);
        console.log(rolesArray)
        const result = req.roles.some(role => rolesArray.includes(role));
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles