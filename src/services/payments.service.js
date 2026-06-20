import api from "./api";

export const payWithMobileMoney = async (bookingId, phone, amount, provider) => {
  const response = await api.post("/payments/mobile-money", {
    bookingId,
    phone,
    amount,
    provider,
  });
  return response.data;
};