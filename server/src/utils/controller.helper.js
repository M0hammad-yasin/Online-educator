import { Role } from "../constant.js";

// Build filter for student and teacher queries
class ControllerHelper {
  buildFilter(role, query = {}) {
    const filter = {};

    // Common filters for both roles
    if (query.address) {
      filter.address = query.address;
    }

    if (query.createdAt) {
      filter.createdAt = query.createdAt;
    }

    // Role specific filters
    switch (role) {
      case Role.STUDENT:
        if (query?.grade) {
          filter.grade = query.grade;
        }
        if (query?.region) {
          filter.region = query.region;
        }
        break;

      case Role.TEACHER:
        if (query?.qualification) {
          filter.qualification = query.qualification;
        }
        break;

      default:
        break;
    }

    return filter;
  }
}

export const controllerHelper = new ControllerHelper();
