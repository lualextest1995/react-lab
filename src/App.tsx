import { Button } from "@/components/ui/button";
import { login } from "./apis/user";

export default function App() {
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
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={handleLogin}>Click me</Button>
    </div>
  );
}
