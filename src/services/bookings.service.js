import api from "./api";

export const createBooking = async (scheduleId) => {
  const response = await api.post("/bookings", { scheduleId });
  return response.data.booking;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data.bookings;
};