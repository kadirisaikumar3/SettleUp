describe("Authorization", () => {
  test("should reject requests without an authentication token", async () => {
    const response = await fetch("http://localhost:5000/api/groups");

    expect(response.status).toBe(401);

    const data = await response.json();

    expect(data.status).toBe("error");
    expect(data.message).toBe("Authentication token is required");
  });
});
test("should reject an invalid authentication token", async () => {
  const response = await fetch("http://localhost:5000/api/groups", {
    headers: {
      Authorization: "Bearer invalid-token",
    },
  });

  expect(response.status).toBe(401);

  const data = await response.json();

  expect(data.status).toBe("error");
  expect(data.message).toBe("Invalid or expired authentication token");
});
describe("Expense Authorization", () => {
  test("should reject unauthenticated expense requests", async () => {
    const response = await fetch("http://localhost:5000/api/expenses");

    expect(response.status).toBe(401);

    const data = await response.json();

    expect(data.status).toBe("error");
    expect(data.message).toBe("Authentication token is required");
  });
});
describe("Settlement Authorization", () => {
  test("should reject unauthenticated settlement requests", async () => {
    const response = await fetch(
      "http://localhost:5000/api/settlements/group/test-group-id",
    );

    expect(response.status).toBe(401);

    const data = await response.json();

    expect(data.status).toBe("error");
    expect(data.message).toBe("Authentication token is required");
  });
});
