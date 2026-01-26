import assert from "node:assert/strict";

export function assertApprox(actual: number, expected: number, tolerance: number, message?: string) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    message || `Expected ${actual} to be within ${tolerance} of ${expected}`
  );
}

export function assertTruthy(value: unknown, message?: string) {
  assert.ok(value, message || "Expected value to be truthy");
}

export function assertEqual<T>(actual: T, expected: T, message?: string) {
  assert.strictEqual(actual, expected, message);
}
