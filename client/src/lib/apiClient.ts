import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000", // ← NestJSのAPIサーバーURLに合わせる
  withCredentials: true, // Cookieを送信
});

// インターセプターで自動リフレッシュ
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 かつ retry していない かつ refresh自体じゃないリクエスト
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await apiClient.post("/auth/refresh");
        if (refreshResponse.status === 200) {
          return apiClient(originalRequest); // アクセストークン更新後、再リクエスト
        }
      } catch (refreshError) {
        console.error("リフレッシュ失敗:", refreshError);

        // 🔴 リフレッシュも失敗 → 強制ログアウト（ログインページへ）
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
