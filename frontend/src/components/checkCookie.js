export const hasAccessToken = () => {
  console.log("access", document.cookie);

  return document.cookie.split("; ").some((c) => c.startsWith("accesstoken="));
};
export const hasRefreshToken = () => {
  console.log("refresh", document.cookie);

  return document.cookie.split("; ").some((c) => c.startsWith("refreshtoken="));
};
