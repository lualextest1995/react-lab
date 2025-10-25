import { useLoaderData, Link } from "react-router";
import { Button } from "@/components/ui/button";

export async function loader() {
  console.log("Test3 loader: 加载测试页面3数据");
  return { page: "test3", message: "这是测试页面 3" };
}

export default function Test3() {
  const data = useLoaderData<{ page: string; message: string }>();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-2xl w-full border rounded-lg p-8 bg-gradient-to-br from-green-50 to-teal-50 shadow-lg">
        <h1 className="text-4xl font-bold text-green-700 mb-4">测试页面 3</h1>
        <p className="text-xl text-slate-700 mb-6">{data.message}</p>

        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">页面信息</h2>
          <ul className="space-y-2 text-slate-600">
            <li>• 当前页面: {data.page}</li>
            <li>• 路由路径: /test3</li>
            <li>• 已应用日志 middleware</li>
            <li>• Loader 已执行（查看控制台）</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link to="/test2">
            <Button variant="outline">上一页 (Test2)</Button>
          </Link>
          <Link to="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
