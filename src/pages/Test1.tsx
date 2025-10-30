import { useState } from "react";
import { useLoaderData, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ROUTE_QUERY_PREFIX_MAP } from "@/router/routeQueryMap";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  console.log("Test1 loader: 加载测试页面1数据");
  return { page: "test1", message: "这是测试页面 1" };
}

export default function Test1() {
  const data = useLoaderData<{ page: string; message: string }>();
  const [note, setNote] = useState("");
  const [favorite, setFavorite] = useState(false);

  const {
    data: data1,
    // error,
    // isFetching,
    refetch,
  } = useQuery({
    queryKey: [`${ROUTE_QUERY_PREFIX_MAP["/test1"]}list`],
    queryFn: getTodos,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 0, // 0 seconds
    enabled: true,
    retry: 1,
    retryDelay: 1000,
    gcTime: Infinity,
  });

  function getTodos() {
    return axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.data);
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-2xl w-full border rounded-lg p-8 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">测试页面 1</h1>
        <p className="text-xl text-slate-700 mb-6">{data?.message}</p>

        <Button onClick={() => refetch()}>refetch</Button>

        <pre>{JSON.stringify(data1, null, 2)}</pre>

        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            页面信息
          </h2>
          <ul className="space-y-2 text-slate-600">
            <li>• 当前页面: {data?.page}</li>
            <li>• 路由路径: /test1</li>
            <li>• 已应用日志 middleware</li>
            <li>• Loader 已执行（查看控制台）</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              页面便签（切换标签后应继续保留）
            </p>
            <Input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="记录一些内容试试看..."
            />
            {note && (
              <p className="mt-2 text-sm text-slate-600">
                当前字数：{note.length}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(event) => setFavorite(event.target.checked)}
            />
            标记为常用页面
          </label>
        </div>

        <div className="flex gap-4">
          <Link to="/">
            <Button variant="outline">返回首页</Button>
          </Link>
          <Link to="/test2">
            <Button>下一页 (Test2)</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
