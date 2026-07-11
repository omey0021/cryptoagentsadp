const requestCounts = new Map();

function rateLimiter(maxRequests = 100, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip).filter(ts => now - ts < windowMs);
    timestamps.push(now);
    requestCounts.set(ip, timestamps);

    const remaining = Math.max(0, maxRequests - timestamps.length);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

    if (timestamps.length > maxRequests) {
      return res.status(429).json({
        code: 'rate_limit_exceeded',
        message: `Rate limit of ${maxRequests} requests per ${windowMs / 1000}s exceeded`,
        retry_after: Math.ceil(windowMs / 1000)
      });
    }

    next();
  };
}

module.exports = rateLimiter;