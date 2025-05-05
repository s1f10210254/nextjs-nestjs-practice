const scheduleTokenRefresh = (expiresIn: number) => {
  const now = Date.now();
  const refreshTime = expiresIn - 5 * 60 * 1000; // 有効期限の5分前にリフレッシュ

  if (refreshTime > now) {
    const delay = refreshTime - now;
    setTimeout(refreshToken, delay);
  } else {
    // すでに期限切れの場合は即座にリフレッシュ
    refreshToken();
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch("/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.expiresIn) {
        scheduleTokenRefresh(data.expiresIn);
      }
    } else {
      console.error("Token refresh failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
