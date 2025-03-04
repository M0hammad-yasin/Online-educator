const hasRole = (roles) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  if (roles.includes("MODERATOR")) console.log("yes you");
};
hasRole("MODERATOR");
