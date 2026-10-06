import { mathReadings } from './math';
import { dlReadings } from './dl';
import { mlReadings } from './ml';
import { rlReadings } from './rl';
import { llmReadings } from './llm';
import { pytorchReadings } from './pytorch';
import { designReadings } from './design';
import type { Reading } from './types';
export const readings: Record<string, Reading> = { ...mathReadings, ...dlReadings, ...mlReadings, ...rlReadings, ...llmReadings, ...pytorchReadings, ...designReadings };
