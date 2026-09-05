class MaxHeap {
  constructor() {
    this.heap = [];
  }

  get size() {
    return this.heap.length;
  }

  insert(item) {
    this.heap.push(item);
    this.bubbleUp();
  }

  extractMax() {
    if (this.heap.length === 0) {
      return null;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const max = this.heap[0];

    this.heap[0] = this.heap.pop();

    this.bubbleDown();

    return max;
  }

  peek() {
    if (this.heap.length === 0) {
      return null;
    }

    return this.heap[0];
  }

  bubbleUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.heap[parentIndex].amount >= this.heap[index].amount) {
        break;
      }

      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];

      index = parentIndex;
    }
  }

  bubbleDown() {
    let index = 0;

    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      let largest = index;

      if (
        leftChild < this.heap.length &&
        this.heap[leftChild].amount > this.heap[largest].amount
      ) {
        largest = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild].amount > this.heap[largest].amount
      ) {
        largest = rightChild;
      }

      if (largest === index) {
        break;
      }

      [this.heap[index], this.heap[largest]] = [
        this.heap[largest],
        this.heap[index],
      ];

      index = largest;
    }
  }
}

module.exports = MaxHeap;
