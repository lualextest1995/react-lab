import { useState, useRef, forwardRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/Dialog";
import { type DialogControlRef, useDialogControl } from "@/hooks/useDialogControl";
import { ConfirmDialog, type ConfirmDialogPayload } from "@/components/ConfirmDialog";

// 範例 3: 使用 extraMethods 擴展額外方法的 Dialog 組件
// 定義額外的自定義方法介面
interface AdvancedDialogRef {
  reset: () => void;
  updateTitle: (title: string) => void;
}

interface AdvancedDialogPayload {
  title?: string;
  content?: string;
}

const AdvancedDialog = forwardRef<
  DialogControlRef<AdvancedDialogPayload> & AdvancedDialogRef,
  object
>((_, ref) => {
  const [title, setTitleState] = useState("進階對話框");
  const [content, setContent] = useState("");

  // 使用 useDialogControl 並透過 extraMethods 擴展自定義方法
  const { open, setOpen, payload } = useDialogControl<AdvancedDialogRef, AdvancedDialogPayload>(
    ref,
    {
      // 自定義方法 1: 重置所有內容
      reset: () => {
        setTitleState("進階對話框");
        setContent("");
      },
      // 自定義方法 2: 動態更新標題
      updateTitle: (newTitle: string) => {
        setTitleState(newTitle);
      },
    }
  );

  // 當開啟對話框時，根據 payload 設定初始值
  useEffect(() => {
    if (open && payload) {
      if (payload.title) setTitleState(payload.title);
      if (payload.content) setContent(payload.content);
    }
  }, [open, payload]);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      title={title}
      description="透過 extraMethods 擴展的進階對話框，支援自定義方法"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={() => {
            console.log("儲存資料:", { title, content });
            setOpen(false);
          }}>
            儲存
          </Button>
        </>
      }
    >
      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">內容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="請輸入內容..."
            rows={5}
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2 text-gray-700">測試 extraMethods：</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => {
                const newTitle = `標題已修改 (${new Date().toLocaleTimeString()})`;
                setTitleState(newTitle);
              }}
              variant="secondary"
              size="sm"
            >
              動態修改標題
            </Button>
            <Button
              onClick={() => {
                setTitleState("進階對話框");
                setContent("");
              }}
              variant="outline"
              size="sm"
            >
              重置內容
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            目前標題：<span className="font-semibold">{title}</span>
          </div>
        </div>
      </div>
    </AppDialog>
  );
});

AdvancedDialog.displayName = "AdvancedDialog";

export default function DialogExamples() {
  // 範例 1: 直接使用 Dialog 的狀態
  const [simpleDialogOpen, setSimpleDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ name: "", email: "" });

  // 範例 2: 使用 ref 控制的 Dialog
  const confirmDialogRef = useRef<DialogControlRef<ConfirmDialogPayload>>(null);

  // 範例 3: 使用 extraMethods 擴展的 Dialog
  const advancedDialogRef = useRef<DialogControlRef<AdvancedDialogPayload> & AdvancedDialogRef>(null);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <div className="w-full max-w-4xl border-4 border-purple-300 rounded-lg p-6 bg-purple-50">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">Dialog 使用範例</h1>

        {/* 範例 1: 直接使用 Dialog */}
        <div className="mb-6 p-4 border-2 border-purple-200 rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-3 text-purple-600">
            範例 1: 直接使用 AppDialog (狀態控制)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            直接在父組件中管理 Dialog 的開關狀態和內容
          </p>
          <Button
            onClick={() => setSimpleDialogOpen(true)}
            variant="default"
          >
            打開簡單對話框
          </Button>

          <AppDialog
            open={simpleDialogOpen}
            onOpenChange={setSimpleDialogOpen}
            title="用戶資料表單"
            description="請填寫您的基本資料"
            size="md"
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => setSimpleDialogOpen(false)}
                >
                  取消
                </Button>
                <Button onClick={() => {
                  console.log("提交資料:", dialogData);
                  setSimpleDialogOpen(false);
                }}>
                  提交
                </Button>
              </>
            }
          >
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">姓名</label>
                <input
                  type="text"
                  value={dialogData.name}
                  onChange={(e) => setDialogData({ ...dialogData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="請輸入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={dialogData.email}
                  onChange={(e) => setDialogData({ ...dialogData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="請輸入 Email"
                />
              </div>
            </div>
          </AppDialog>
        </div>

        {/* 範例 2: 使用 ref 控制的 Dialog */}
        <div className="mb-6 p-4 border-2 border-purple-200 rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-3 text-purple-600">
            範例 2: 封裝 Component + useDialogControl Hook (Ref 控制)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            將 Dialog 封裝成可重用組件，透過 ref 和 hook 控制，支援傳入 payload
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => confirmDialogRef.current?.open({
                title: "刪除確認",
                message: "您確定要刪除這筆資料嗎？此操作無法復原。"
              })}
              variant="destructive"
            >
              刪除資料
            </Button>
            <Button
              onClick={() => confirmDialogRef.current?.open({
                title: "發布文章",
                message: "確定要發布這篇文章嗎？發布後所有用戶都能看到。"
              })}
              variant="default"
            >
              發布文章
            </Button>
          </div>

          <ConfirmDialog ref={confirmDialogRef} />
        </div>

        {/* 範例 3: 使用 extraMethods 擴展方法 */}
        <div className="p-4 border-2 border-purple-200 rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-3 text-purple-600">
            範例 3: 使用 extraMethods 擴展額外方法
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            透過 extraMethods 參數為 Dialog ref 添加自定義方法（如 reset、updateTitle）
          </p>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => advancedDialogRef.current?.open({
                  title: "編輯文章",
                  content: "這是預設的文章內容..."
                })}
                variant="default"
              >
                打開進階對話框
              </Button>
              <Button
                onClick={() => {
                  advancedDialogRef.current?.open();
                  setTimeout(() => {
                    advancedDialogRef.current?.updateTitle("外部調用 updateTitle ✨");
                  }, 500);
                }}
                variant="secondary"
              >
                打開並從外部修改標題
              </Button>
              <Button
                onClick={() => advancedDialogRef.current?.reset()}
                variant="outline"
              >
                外部調用 reset
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              💡 提示：對話框內部也有測試按鈕，可以直接調用 extraMethods
            </p>
          </div>

          <AdvancedDialog ref={advancedDialogRef} />
        </div>
      </div>
    </div>
  );
}
