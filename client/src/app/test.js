// implement a linked list
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(head = null) {
    this.head = head;
  }

  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  remove(value) {
    let current = this.head;
    if (current.value === value) {
      this.head = current.next;
      return;
    }
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }

  contains(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  sort() {
    let current = this.head;
    let next = null;
    let temp = null;
    while (current) {
      next = current.next;
      while (next) {
        if (current.value > next.value) {
          temp = current.value;
          current.value = next.value;
          next.value = temp;
        }
        next = next.next;
      }
      current = current.next;
    }
  }

  [Symbol.iterator]() {
    let current = this.head;
    return {
      next() {
        if (current) {
          const value = current.value;
          current = current.next;
          return { value, done: false };
        }
        return { done: true };
      },
    };
  }
}

// Function compares performance of array vs linkedlist; both are examined by being filed with 1000000 elements and then being sorted
export function comparePerformance() {
  console.log("comparePerformance");
  const array = [];
  const linkedList = new LinkedList();
  for (let i = 0; i < 1_00_000; i++) {
    array.push(i);
    linkedList.add(i);
  }
  console.time("array");
  array.sort();
  console.timeEnd("array");
  console.time("linkedlist");
  linkedList.sort();
  console.timeEnd("linkedlist");
}
