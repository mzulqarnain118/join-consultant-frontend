import axios from "axios";
import constant from "./config";
import {browserName, browserVersion} from "react-device-detect";

var accessTokenExpiry = 7200;

export async function callEndpoint(methodType, authorisationType, URL, data) {
  if (authorisationType === "Bearer") {
    var accessToken = getCookie("accessToken");
    if (accessToken == null) {
      return new Promise((resolve, reject) => {
        // window.location.href = "/login";
      });
    } else {
      return new Promise((resolve, reject) => {
        axios({
          url: constant.baseUrl + URL,
          method: methodType,
          headers: {
            Authorization: "Bearer " + getCookie("accessToken"),
            appplatform: "WEBSITE",
            appversion: "1.0.0",
            "User-Agent": `${browserName} ${browserVersion}`,
          },
          data: data,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((ex) => {
            try {
              if (ex.response.data.message !== undefined) {
                if (ex.response.data.message.toLowerCase() === "unauthorized") {
                  getRefreshToken().then((response) => {
                    callEndpoint(methodType, authorisationType, URL, data)
                      .then((response) => {
                        resolve(response);
                      })
                      .catch(reject);
                  });
                } else {
                  reject({error: ex.response.data.message});
                }
              } else {
                if (ex.toString().includes("Network Error")) {
                  reject({error: "Network Error"});
                } else if (axios.isCancel(ex)) {
                  reject({Cancel: ""});
                } else {
                  reject({error: ex.response.data.message});
                }
              }
            } catch (error) {
              reject({error: "Network Error"});
              window.location.href = "/consultant";
            }
          });
      });
    }
  } else if (authorisationType === "Basic") {
    var headerObject = {};
    headerObject.Authorization = "Basic " + new Buffer.from(constant.username + ":" + constant.password).toString("base64");
    headerObject.appplatform = "WEBSITE";
    headerObject.appversion = "1.0.0";
    return new Promise((resolve, reject) => {
      axios({
        url: constant.baseUrl + "" + URL,
        method: methodType,
        headers: headerObject,
        data: data,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((ex) => {
          reject({error: ex.response.data.message});
        });
    });
  }
}

export async function getAccessToken(username, password, keepmesignedin = true) {
  var headerObject = {};
  headerObject.Authorization = "Basic " + new Buffer.from(username + ":" + password).toString("base64");
  headerObject.appplatform = "WEBSITE";
  headerObject.appversion = "1.0.0";
  var data = {
    accessTokenExpiry: accessTokenExpiry,
    keepMeSignedIn: keepmesignedin,
    getUserInfo: true,
    newcustomer: true,
  };
  return new Promise((resolve, reject) => {
    axios({
      url: constant.baseUrl + "/users/login",
      method: "POST",
      headers: headerObject,
      data: data,
    })
      .then((response) => {
        document.cookie = "accessToken=" + response.data.accessToken;
        document.cookie = "refreshToken=" + response.data.refreshToken;
        resolve(response);
      })
      .catch((ex) => {
        reject({error: ex.response.data.message});
      });
  });
}

function getRefreshToken() {
  var headerDetails = "Basic " + new Buffer.from(constant.username_cinema_app + ":" + constant.password_cinema_app).toString("base64");
  var data = {};
  data.refreshToken = getCookie("refreshToken");
  return new Promise((resolve, reject) => {
    axios({
      url: constant.baseUrl + "/users/refreshToken",
      method: "POST",
      headers: {Authorization: headerDetails},
      data: data,
    })
      .then((response) => {
        document.cookie = "accessToken=" + response.data.accessToken;
        document.cookie = "refreshToken=" + response.data.refreshToken;
        resolve(response);
      })
      .catch((ex) => {
        if (axios.isCancel(ex)) {
          reject({Cancel: ""});
        } else if (ex.response.data.code !== 200 || ex.response.data.message.toLowerCase() === "token invalid") {
          document.cookie = "accessToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "refreshToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
          document.location.href = "/";
        }
      });
  });
}

export function getValueFromCookie(cookieName) {
  return getCookie(cookieName);
}

function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}
