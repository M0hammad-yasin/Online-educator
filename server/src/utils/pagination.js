// server/src/Utils/pagination.js
export const DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100,
};

function toInt(val, fallback) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) ? n : fallback;
}

export  function getPagination(query = {}, options = {}) {
  const cfg = { ...DEFAULTS, ...options };

  // Aliases
  const pageRaw = query.page ?? query.p ?? query.currentPage;
  const limitRaw = query.limit ?? query.perPage ?? query.size;
  const offsetRaw = query.skip ?? query.offset;

  // Parse values
  let limit = toInt(limitRaw, cfg.limit);
  limit = Math.max(1, Math.min(cfg.maxLimit, limit));

  let page = toInt(pageRaw, cfg.page);
  page = Math.max(1, page);

  // If offset is provided, derive page from offset & limit
  const hasOffset = offsetRaw !== undefined && offsetRaw !== null && offsetRaw !== '';
  const offset = hasOffset ? Math.max(0, toInt(offsetRaw, 0)) : (page - 1) * limit;

  if (hasOffset) {
    page = Math.floor(offset / limit) + 1;
  }

  const skip = offset;
  const take = limit;

  return { page, limit, skip, take };
}

export function buildPaginationMeta(totalItems, page, limit ) {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}