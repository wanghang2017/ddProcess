
let host = "";
let loginHost = "";
switch (process.env.NODE_ENV) {
    case "development":
        loginHost = "";
        host = "";
        break
    case "test":
        host = "";
        loginHost = "";
        break
    case "gray":
        host = "";
        loginHost = "";
        break
    case "production":
        host = "";
        loginHost = "";
        break
    default:
        break
}
export {
    host,
    loginHost
}
