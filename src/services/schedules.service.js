import api from "./api";

export const searchSchedules = async (from, to, date, agencyId) => {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (date) params.append("date", date);
  if (agencyId) params.append("agencyId", agencyId);

  const response = await api.get(`/schedules/search?${params.toString()}`);
  return response.data.schedules;
};