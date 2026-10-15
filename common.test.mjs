import { calculateRevisionDates } from "./common.mjs";
import assert from "node:assert/strict";
import test from "node:test";

test("calculates all five revision dates from the study date", () => {
  // deepEqual checks every date in the returned array.
  assert.deepEqual(calculateRevisionDates("2027-07-19"), [
    "2027-07-26",
    "2027-08-19",
    "2027-10-19",
    "2028-01-19",
    "2028-07-19",
  ]);
});

test("keeps exact dates across the spring daylight-saving change", () => {
  assert.deepEqual(calculateRevisionDates("2027-03-25"), [
    "2027-04-01",
    "2027-04-25",
    "2027-06-25",
    "2027-09-25",
    "2028-03-25",
  ]);
});

test("keeps exact dates across the autumn daylight-saving change", () => {
  assert.deepEqual(calculateRevisionDates("2027-10-28"), [
    "2027-11-04",
    "2027-11-28",
    "2028-01-28",
    "2028-04-28",
    "2028-10-28",
  ]);
});

test("adjusts dates when the target month is shorter", () => {
  assert.deepEqual(calculateRevisionDates("2027-01-31"), [
    "2027-02-07",
    "2027-02-28",
    "2027-04-30",
    "2027-07-31",
    "2028-01-31",
  ]);
});

test("handles February 29 in a leap year", () => {
  assert.deepEqual(calculateRevisionDates("2028-02-29"), [
    "2028-03-07",
    "2028-03-29",
    "2028-05-29",
    "2028-08-29",
    "2029-02-28",
  ]);
});