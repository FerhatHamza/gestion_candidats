// قاعدة URL الخاصة بـ API — عدلها حسب سيرفرك
const API_BASE_URL = "https://gestion-candidats-api.ferhathamza17.workers.dev/api";

/**
 * 🔹 دالة عامة للطلبات
 * @param {string} endpoint - نهاية المسار (مثل /candidats)
 * @param {string} method - نوع الطلب (GET, POST, PUT, DELETE)
 * @param {object|null} data - البيانات المرسلة (إذا وجدت)
 */
export async function apiRequest(endpoint, method = "GET", data = null) {
    const url = `${API_BASE_URL}${endpoint}`;

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (data) options.body = JSON.stringify(data);

    // console.log(`➡️ API ${method} ${endpoint}`, data || "");
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (err) {
        console.error(`❌ API ${method} ${endpoint} failed:`, err);
        throw err;
    }
}
