import { studentModelConfig } from './models/student.permissions';
import { teacherModelConfig } from './models/teacher.permissions';
import { classModelConfig } from './models/class.permissions';
import { ModelConfig, ModelName } from './rbac-types';

export const modelPermissionsRegistry: Record<ModelName, ModelConfig> = {
  student: studentModelConfig,
  teacher: teacherModelConfig,
  class:classModelConfig,
};

export function getModelConfig(modelName: ModelName): ModelConfig {
  const config = modelPermissionsRegistry[modelName];
  if (!config) {
    throw new Error(`Model config not found for: ${modelName}`);
  }
  return config;
}

export { studentModelConfig, teacherModelConfig };


