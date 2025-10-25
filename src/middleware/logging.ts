export const loggingMiddleware = async (
  { request }: { request: Request },
  next: () => Promise<unknown>
) => {
  const start = performance.now();
  const url = new URL(request.url);

  console.log(`[${new Date().toISOString()}] 開始導航: ${url.pathname}`);

  // 繼續執行下一個 middleware 或 loader
  await next();

  const duration = performance.now() - start;
  console.log(
    `[${new Date().toISOString()}] 導航完成: ${url.pathname} (${duration.toFixed(2)}ms)`
  );
};
