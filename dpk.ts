import crypto from "crypto";
import * as R from 'ramda'

export interface EventObj {
  partitionKey: any;
}

export const deterministicPartitionKey = (event?: EventObj | any): string => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  const getCandidateInEvent = (event?: EventObj): any => {
    if (event && !event.partitionKey) {
      const data = JSON.stringify(event);
      return crypto.createHash("sha3-512").update(data).digest("hex");
    }

    return event?.partitionKey;
  }

  const candidateToString = (candidate: any): string => { 
    if (candidate && typeof candidate !== "string")
      return JSON.stringify(candidate);

    return candidate ?? TRIVIAL_PARTITION_KEY;
  }

  const fixCandidateToMaxLength = (candidate: string): string => {
    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      return crypto.createHash("sha3-512").update(candidate).digest("hex");
    }

    return candidate;
  }

  return R.pipe(
    getCandidateInEvent,
    candidateToString,
    fixCandidateToMaxLength,
  )(event);
};
