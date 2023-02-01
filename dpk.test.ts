import { EventObj } from "./dpk";
import { deterministicPartitionKey } from "./dpk";
import { faker } from '@faker-js/faker';
import crypto from "crypto";

describe("deterministicPartitionKey", () => {
  it("should return literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  describe('partition key is string', () => {
    it("should return partitionKey and less than max length", () => {
      const event: EventObj = {
        partitionKey: faker.datatype.string(256),
      };

      const trivialKey = deterministicPartitionKey(event);
      expect(trivialKey).toBe(event.partitionKey);
    })

    it('should return partitionKey encrypted if exceeds max length', () => {
      const event: EventObj = {
        partitionKey: faker.datatype.string(257),
      };

      const trivialKey = deterministicPartitionKey(event);
      const encrypted = crypto.createHash("sha3-512").update(event.partitionKey).digest("hex");

      expect(trivialKey).toBe(encrypted);
    })
  })

  describe('partition key is not string', () => {
    it('should return partition key encrypted if exceeds max length', () => {
      const event: EventObj = {
        partitionKey: {
          test: faker.datatype.string(257)
        }
      };

      const trivialKey = deterministicPartitionKey(event);

      const data = JSON.stringify(event.partitionKey);
      const encrypted = crypto.createHash("sha3-512").update(data).digest("hex");

      expect(trivialKey).toBe(encrypted);
    })

    it('should return partitionKey as JSON if less than max length', () => {
      const event: EventObj = {
        partitionKey: {
          test: faker.random.word()
        }
      };

      const trivialKey = deterministicPartitionKey(event);
      const data = JSON.stringify(event.partitionKey);

      expect(trivialKey).toBe(data);
    })
  })

  it('should return event encrypted if has no partition key', () => {
    const event = {
      test: faker.random.word()
    };

    const trivialKey = deterministicPartitionKey(event);

    const data = JSON.stringify(event);
    const encrypted = crypto.createHash("sha3-512").update(data).digest("hex");

    expect(trivialKey).toBe(encrypted);
  })
});
