import api from "./api";

// Stations
export const getStations = async () => {
  const res = await api.get("/stations");
  return res.data.stations;
};

export const createStation = async (name, city, address) => {
  const res = await api.post("/stations", { name, city, address });
  return res.data.station;
};

// Agencies
export const getAgencies = async () => {
  const res = await api.get("/agencies");
  return res.data.agencies;
};

export const createAgency = async (name, email, phone) => {
  const res = await api.post("/agencies", { name, email, phone });
  return res.data.agency;
};

// Link agency to station
export const linkAgencyToStation = async (agencyId, stationId, counterNumber) => {
  const res = await api.post(`/agencies/${agencyId}/stations`, { stationId, counterNumber });
  return res.data.link;
};

// Create Agency Admin
export const createAgencyAdmin = async (name, email, phone, password, agencyId) => {
  const res = await api.post("/users/agency-admin", { name, email, phone, password, agencyId });
  return res.data.user;
};
export const getPlatformOverview = async () => {
  const res = await api.get("/reports/platform-overview");
  return res.data;
};