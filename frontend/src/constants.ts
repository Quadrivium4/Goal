export const baseUrl =  process.env.NODE_ENV === 'development'? "http://" + window.location.hostname +":5000": process.env.NODE_ENV === "production"? "https://goalapi-e96x.onrender.com": "";
export const protectedUrl = baseUrl + "/protected";
export const assetsUrl = baseUrl + "/assets/users";
export const dayInMilliseconds = 1000 * 60* 60 *24
export const todayDate = Date.now();