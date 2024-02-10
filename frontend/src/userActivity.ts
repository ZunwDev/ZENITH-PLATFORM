let userIsActive = false;
import { setCookies } from "@/lib/utils";
import Cookies from "js-cookie";

const data = {
  username: Cookies.get("firstName"),
  roleId: Cookies.get("roleId"),
  userId: Cookies.get("userId"),
  rememberMe: Cookies.get("rememberMe"),
};

function setUserActive() {
  userIsActive = true;
}

function checkUserActivity() {
  userIsActive = false;

  window.addEventListener("mousemove", setUserActive);
  window.addEventListener("keypress", setUserActive);
  window.addEventListener("click", setUserActive);

  setTimeout(checkUserActivity, 5 * 60 * 1000);
}

checkUserActivity();

function renewSession() {
  if (
    userIsActive &&
    data.roleId !== undefined &&
    data.username !== undefined &&
    data.userId !== undefined &&
    data.rememberMe === "false"
  ) {
    const validData = {
      roleId: data.roleId,
      username: data.username,
      userId: data.userId,
      rememberMe: data.rememberMe,
    };
    setCookies(validData, 0.25, "false");
  }
}

setInterval(renewSession, 10 * 60 * 1000);
