const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
};

const setAccessTokenCookie = (res, token) => {
  res.cookie('token', token, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  setAccessTokenCookie(res, accessToken);
  if (refreshToken) {
    setRefreshTokenCookie(res, refreshToken);
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

module.exports = {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setAuthCookies,
  clearAuthCookies,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
};
