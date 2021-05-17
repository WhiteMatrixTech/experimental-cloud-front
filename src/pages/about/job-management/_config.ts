export enum JobStatus {
  Unknown = 'Unknown',
  Running = 'Running',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
}

export enum JobCategory {
  DeploymentJob = 'DeploymentJob',
  ImageBuildJob = 'ImageBuildJob',
}
