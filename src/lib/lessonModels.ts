import { mathModels } from './mathModels';
import { dlModels } from './dlModels';
import { mlModels } from './mlModels';
import { rlModels } from './rlModels';
import { llmModels } from './llmModels';
import { pytorchModels } from './pytorchModels';
import { designModels } from './designModels';
import type { LessonModel } from './lessonModelTypes';
export const lessonModels:Record<string,LessonModel>={...mathModels,...dlModels,...mlModels,...rlModels,...llmModels,...pytorchModels,...designModels};
