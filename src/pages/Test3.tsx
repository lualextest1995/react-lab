import { useState } from "react";
import { useLoaderData, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  console.log("Test3 loader: 加载测试页面3数据");
  return { page: "test3", message: "这是测试页面 3" };
}

export default function Test3() {
  const data = useLoaderData<{ page: string; message: string }>();
  const [draftTask, setDraftTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-2xl w-full border rounded-lg p-8 bg-gradient-to-br from-green-50 to-teal-50 shadow-lg">
        <h1 className="text-4xl font-bold text-green-700 mb-4">测试页面 3</h1>
        <p className="text-xl text-slate-700 mb-6">{data?.message}</p>

        <div className="bg-white rounded-lg p-6 mb-6 shadow">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            页面信息
          </h2>
          <ul className="space-y-2 text-slate-600">
            <li>• 当前页面: {data?.page}</li>
            <li>• 路由路径: /test3</li>
            <li>• 已应用日志 middleware</li>
            <li>• Loader 已执行（查看控制台）</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow space-y-4">
          <p className="text-sm font-medium text-slate-500">
            记录测试任务（返回其他标签再回来应该保留）
          </p>
          <div className="flex gap-2">
            <Input
              value={draftTask}
              onChange={(event) => setDraftTask(event.target.value)}
              placeholder="新增需要验证的事项..."
            />
            <Button
              onClick={() => {
                if (!draftTask.trim()) return;
                setTasks((prev) => [...prev, draftTask.trim()]);
                setDraftTask("");
              }}
            >
              新增
            </Button>
          </div>
          {tasks.length > 0 ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {tasks.map((task, index) => (
                <li
                  key={`${task}-${index}`}
                  className="flex justify-between items-center rounded bg-slate-100 px-3 py-1.5"
                >
                  <span>{task}</span>
                  <button
                    type="button"
                    className="text-xs text-teal-700 hover:underline"
                    onClick={() =>
                      setTasks((prev) => prev.filter((_, idx) => idx !== index))
                    }
                  >
                    移除
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">目前尚未新增任务。</p>
          )}
        </div>

        <div className="flex gap-4">
          <Link to="/test2">
            <Button variant="outline">上一页 (Test2)</Button>
          </Link>
          <Link to="/test4">
            <Button>下一页 (Test4)</Button>
          </Link>
          <Link to="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
