const MaxHeap = require("../src/algorithms/MaxHeap");

describe("MaxHeap", () => {
  test("should return the largest amount first", () => {
    const heap = new MaxHeap();

    heap.insert({ userId: "Sai", amount: 2000 });
    heap.insert({ userId: "Deepa", amount: 5000 });
    heap.insert({ userId: "Siri", amount: 3000 });

    expect(heap.extractMax()).toEqual({
      userId: "Deepa",
      amount: 5000,
    });

    expect(heap.extractMax()).toEqual({
      userId: "Siri",
      amount: 3000,
    });

    expect(heap.extractMax()).toEqual({
      userId: "Sai",
      amount: 2000,
    });
  });

  test("peek should return the largest item without removing it", () => {
    const heap = new MaxHeap();

    heap.insert({ userId: "Sai", amount: 2000 });
    heap.insert({ userId: "Deepa", amount: 4000 });

    expect(heap.peek()).toEqual({
      userId: "Deepa",
      amount: 4000,
    });

    expect(heap.size).toBe(2);
  });

  test("empty heap should return null", () => {
    const heap = new MaxHeap();

    expect(heap.peek()).toBeNull();
    expect(heap.extractMax()).toBeNull();
    expect(heap.size).toBe(0);
  });
});
