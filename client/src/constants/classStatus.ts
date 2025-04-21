// Define class status constants as readonly to make them non-writable
export const CLASS_STATUS = Object.freeze({
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
}) as {
  readonly UPCOMING: string;
  readonly ACTIVE: string;
  readonly COMPLETED: string;
  readonly CANCELLED: string;
};

// Export the status values as an array for dropdown options
export const CLASS_STATUS_OPTIONS = Object.values(CLASS_STATUS);
