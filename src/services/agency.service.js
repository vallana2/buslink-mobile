// src/services/agency.service.js
import api from "./api";

// Buses
export const getAgencyBuses = async () => {
  const res = await api.get("/buses");
  return res.data.buses;
};

export const createBus = async (payload) => {
  const res = await api.post("/buses", payload);
  return res.data.bus;
};

export const deleteBus = async (id) => {
  const res = await api.delete(`/buses/${id}`);
  return res.data;
};

// Routes
export const getAgencyRoutes = async () => {
  const res = await api.get("/routes");
  return res.data.routes;
};

export const createRoute = async (payload) => {
  const res = await api.post("/routes", payload);
  return res.data.route;
};

export const deleteRoute = async (id) => {
  const res = await api.delete(`/routes/${id}`);
  return res.data;
};

// Schedules
export const getAgencySchedules = async () => {
  const res = await api.get("/schedules");
  return res.data.schedules;
};

export const createSchedule = async (payload) => {
  const res = await api.post("/schedules", payload);
  return res.data.schedule;
};

export const deleteSchedule = async (id) => {
  const res = await api.delete(`/schedules/${id}`);
  return res.data;
};

// Bookings
export const getAgencyBookings = async () => {
  const res = await api.get("/bookings/agency/all");
  return res.data.bookings;
};

// Reports
export const getBookingReport = async () => {
  const res = await api.get("/reports/bookings");
  return res.data;
};

export const getRevenueReport = async () => {
  const res = await api.get("/reports/revenue");
  return res.data;
};