const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getUsers = async () => {
  return apiRequest("/users");
};

export const getGroups = async () => {
  return apiRequest("/groups");
};

export const createGroup = async (groupData) => {
  return apiRequest("/groups", {
    method: "POST",
    body: JSON.stringify(groupData),
  });
};

export const updateGroup = async (groupId, groupData) =>
  apiRequest(`/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(groupData),
  });

export const getGroup = async (groupId) => {
  return apiRequest(`/groups/${groupId}`);
};

export const getGroupExpenses = async (groupId) => {
  return apiRequest(`/groups/${groupId}/expenses`);
};

export const getGroupBalances = async (groupId) => {
  return apiRequest(`/groups/${groupId}/balances`);
};

export const getGroupSettlement = async (groupId) => {
  return apiRequest(`/groups/${groupId}/settlement`);
};

export const createExpense = async (expenseData) =>
  apiRequest("/expenses", {
    method: "POST",
    body: JSON.stringify(expenseData),
  });

export default apiRequest;
