import { useLoaderData } from "react-router";
import DialogExamples from "@/examples/DialogExamples";
import FormExamples from "@/examples/FormExamples";
import VerticalFormExamples from "@/examples/VerticalFormExamples";
import FeedbackFormExamples from "@/examples/FeedbackFormExamples";
import DatePickerExamples from "@/examples/DatePickerExamples";
import { Button } from "@/components/ui/button";
import { login } from "@/apis/user";

export async function loader() {
  console.log("Home loader: 加载首页数据");
  return { page: "home", title: "首页 - 表单示例集合" };
}

export default function Home() {
  const data = useLoaderData<{ page: string; title: string }>();

  const handleLogin = async () => {
    try {
      const response = await login({
        email: "admin@example.com",
        password: "admin123",
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold text-slate-800">{data.title}</h1>

      <DialogExamples />

      <FormExamples />

      <hr className="w-full" />

      <VerticalFormExamples />

      <hr className="w-full" />

      <FeedbackFormExamples />

      <hr className="w-full" />

      <DatePickerExamples />

      <Button onClick={handleLogin}>Test Login API</Button>
    </div>
  );
}
