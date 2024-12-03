import * as process from "node:process"

const tokenName = process.env.TOKEN_NAME ?? "auth_refresh_token"

export { tokenName }
