export function getUser() {
  try {
    const user = sessionStorage.getItem("user");
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  sessionStorage.clear();
  window.location.href = "/login";
}