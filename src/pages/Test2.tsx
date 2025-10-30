import { useEffect, useState } from "react";
import { useLoaderData, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ROUTE_QUERY_PREFIX_MAP } from "@/router/routeQueryMap";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  console.log("Test2 loader: 加载测试页面2数据");
  return { page: "test2", message: "这是测试页面 2" };
}

export default function Test2() {
  const data = useLoaderData<{ page: string; message: string }>();
  const [seconds, setSeconds] = useState(0);
  const [clicks, setClicks] = useState(0);

  const PREFIX = ROUTE_QUERY_PREFIX_MAP["/test/test2"];

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`${PREFIX}users`],
    queryFn: () =>
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => res.data),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 0,
    enabled: true,
    retry: 1,
    retryDelay: 1000,
    gcTime: Infinity,
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-2xl w-full border rounded-lg p-8 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">测试页面 2</h1>
        <p className="text-xl text-slate-700 mb-6">{data?.message}</p>

        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              用戶列表（TanStack Query）
            </h2>
            <Button size="sm" onClick={() => refetch()}>
              重新載入
            </Button>
          </div>
          {isLoading ? (
            <p className="text-slate-500">載入中...</p>
          ) : (
            <div className="max-h-40 overflow-y-auto">
              <ul className="space-y-1 text-sm text-slate-600">
                {usersData?.slice(0, 5).map((user: any) => (
                  <li key={user.id}>
                    • {user.name} ({user.email})
                  </li>
                ))}
              </ul>
              {usersData && usersData.length > 5 && (
                <p className="text-xs text-slate-400 mt-2">
                  顯示前 5 筆，共 {usersData.length} 筆
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            页面信息
          </h2>
          <ul className="space-y-2 text-slate-600">
            <li>• 当前页面: {data?.page}</li>
            <li>• 路由路径: /test2</li>
            <li>• 已应用日志 middleware</li>
            <li>• Loader 已执行（查看控制台）</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow space-y-4">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-purple-600">
              {seconds}s
            </p>
            <span className="text-sm text-slate-500">
              页面停留时间（切换标签时暂停/恢复）
            </span>
          </div>
          <Button
            variant="secondary"
            onClick={() => setClicks((prev) => prev + 1)}
          >
            点我增加计数（当前：{clicks}）
          </Button>
        </div>

        <div className="flex gap-4">
          <Link to="/test1">
            <Button variant="outline">上一页 (Test1)</Button>
          </Link>
          <Link to="/test3">
            <Button>下一页 (Test3)</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
