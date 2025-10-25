# Dialog 組件使用指南

重構後的 Dialog 系統，簡潔、型態安全、易於使用。

## 設計原則

- **YAGNI (You Aren't Gonna Need It)**: 只保留實際使用的功能
- **型態安全**: 使用 TypeScript 判別聯合型別確保狀態一致性
- **簡單優於複雜**: 移除不必要的抽象層

## 方式 1: 直接使用 AppDialog (適用於簡單場景)

適合：表單對話框、資料編輯等需要在父組件管理資料的場景

```tsx
import { useState } from "react";
import AppDialog from "@/components/Dialog";
import { Button } from "@/components/ui/button";

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ name: "", email: "" });

  return (
    <>
      <Button onClick={() => setOpen(true)}>打開對話框</Button>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title="用戶資料"
        description="請填寫基本資料"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              console.log(data);
              setOpen(false);
            }}>
              提交
            </Button>
          </>
        }
      >
        <div className="px-6 py-4">
          <input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="姓名"
          />
        </div>
      </AppDialog>
    </>
  );
}
```

## 方式 2: 封裝可重用組件 + useDialogControl (適用於複雜場景)

適合：確認對話框、通知對話框等可重用的標準化對話框

### 步驟 1: 創建封裝組件

```tsx
// MyDialog.tsx
import { forwardRef } from "react";
import AppDialog from "@/components/Dialog";
import { Button } from "@/components/ui/button";
import { useDialogControl, type DialogControlRef } from "@/hooks/useDialogControl";

// 定義 payload 型別
export interface MyDialogPayload {
  title: string;
  message: string;
}

export const MyDialog = forwardRef<DialogControlRef<MyDialogPayload>>(
  (_, ref) => {
    const { open, setOpen, payload } = useDialogControl<MyDialogPayload>(ref);

    const handleConfirm = () => {
      console.log("確認:", payload);
      setOpen(false);
    };

    return (
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title={payload?.title || "確認操作"}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirm}>確認</Button>
          </>
        }
      >
        <div className="px-6 py-4">
          <p>{payload?.message}</p>
        </div>
      </AppDialog>
    );
  }
);

MyDialog.displayName = "MyDialog";
```

### 步驟 2: 使用封裝組件

```tsx
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MyDialog, type MyDialogPayload } from "./MyDialog";
import { type DialogControlRef } from "@/hooks/useDialogControl";

function ParentComponent() {
  const dialogRef = useRef<DialogControlRef<MyDialogPayload>>(null);

  return (
    <>
      <Button onClick={() => dialogRef.current?.open({
        title: "刪除確認",
        message: "確定要刪除嗎？"
      })}>
        刪除
      </Button>

      <MyDialog ref={dialogRef} />
    </>
  );
}
```

## AppDialog Props

```tsx
interface DialogProps {
  open: boolean;                    // 對話框開關狀態
  onOpenChange: (open: boolean) => void;  // 狀態變更回調
  title?: React.ReactNode;          // 標題（可選）
  description?: React.ReactNode;    // 描述（可選）
  footer?: React.ReactNode;         // 底部按鈕區（可選）
  children: React.ReactNode;        // 內容
  size?: "sm" | "md" | "lg" | "full";  // 尺寸（預設 "sm"）
  maxHeight?: string;               // 最大高度（預設 "min(600px, 80vh)"）
  loading?: boolean;                // 顯示載入遮罩（預設 false）
  dismissible?: boolean;            // 點擊外部是否關閉（預設 true）
}
```

### Props 使用說明

#### `maxHeight`
控制 Dialog 的最大高度，內容超過時會自動滾動：

```tsx
<AppDialog maxHeight="400px">  {/* 固定高度 */}
<AppDialog maxHeight="80vh">   {/* 視窗高度的 80% */}
<AppDialog maxHeight="min(500px, 90vh)">  {/* 取較小值 */}
```

#### `loading`
在異步操作時顯示載入遮罩，防止用戶重複操作：

```tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await saveData();
  } finally {
    setLoading(false);
  }
};

<AppDialog loading={loading}>
  <form onSubmit={handleSubmit}>...</form>
</AppDialog>
```

#### `dismissible`
控制是否允許通過點擊外部或按 ESC 關閉 Dialog：

```tsx
{/* 強制用戶完成操作 */}
<AppDialog dismissible={false}>
  <p>請完成必填欄位...</p>
</AppDialog>

{/* 允許隨時關閉（預設） */}
<AppDialog dismissible={true}>
  <p>可選操作...</p>
</AppDialog>
```

## useDialogControl API

```tsx
// 泛型參數：
// - P: Payload 型別
// - T: 額外方法的型別
function useDialogControl<P = void, T extends object = object>(
  ref: React.ForwardedRef<DialogControlRef<P> & T>,
  extraMethods?: T
): {
  open: boolean;
  setOpen: (open: boolean) => void;
  payload: P | undefined;
}

// Ref 介面
interface DialogControlRef<P = void> {
  open: (payload: P) => void;
  close: () => void;
}
```

## 設計優勢

### 1. 符合 React 慣例

使用標準的 `open` / `setOpen` 模式，所有 React 開發者都熟悉：

```tsx
const { open, setOpen, payload } = useDialogControl<MyPayload>(ref);

// ✅ 標準 React 模式，一眼就懂
<AppDialog open={open} onOpenChange={setOpen}>
  <Button onClick={() => setOpen(false)}>關閉</Button>
</AppDialog>
```

### 2. 簡單直接

使用 optional chaining 處理 payload，簡單安全：

```tsx
// ✅ 簡單直接
<h3>{payload?.title}</h3>
<p>{payload?.message}</p>
```

### 3. 靈活性

`setOpen` 可以開啟或關閉，給你完全的控制：

```tsx
setOpen(true);   // 可以手動打開（如果需要）
setOpen(false);  // 關閉
setOpen(!open);  // 切換
```

### 4. 擴展性 - extraMethods

當你需要在 Dialog 內部暴露額外的方法給父組件時，使用 `extraMethods`：

```tsx
// 定義額外方法的型別
interface FormDialogExtraMethods {
  reset: () => void;
  validate: () => boolean;
  getData: () => FormData;
}

// 在 Dialog 組件中
const FormDialog = forwardRef<DialogControlRef<Payload> & FormDialogExtraMethods>(
  (_, ref) => {
    const [formData, setFormData] = useState<FormData>({...});

    // 定義額外的方法
    const extraMethods: FormDialogExtraMethods = {
      reset: () => setFormData({...}),
      validate: () => !!formData.name,
      getData: () => formData,
    };

    // 傳入 extraMethods
    const { open, setOpen, payload } = useDialogControl<Payload, FormDialogExtraMethods>(
      ref,
      extraMethods
    );

    return <AppDialog>...</AppDialog>;
  }
);

// 在父組件中使用
function Parent() {
  const dialogRef = useRef<DialogControlRef<Payload> & FormDialogExtraMethods>(null);

  return (
    <>
      <Button onClick={() => dialogRef.current?.open({...})}>打開</Button>
      <Button onClick={() => dialogRef.current?.reset()}>重置</Button>
      <Button onClick={() => {
        if (dialogRef.current?.validate()) {
          const data = dialogRef.current?.getData();
          console.log(data);
        }
      }}>
        驗證並獲取數據
      </Button>
      <FormDialog ref={dialogRef} />
    </>
  );
}
```

**extraMethods 的實際用途：**
- 表單 Dialog：暴露 `reset()`, `validate()`, `getData()` 等方法
- 多步驟 Dialog：暴露 `nextStep()`, `prevStep()`, `goToStep(n)` 等方法
- 列表 Dialog：暴露 `refresh()`, `getSelected()`, `clearSelection()` 等方法
- 編輯器 Dialog：暴露 `undo()`, `redo()`, `save()` 等方法

## 完整範例

- [DialogExamples.tsx](../../examples/DialogExamples.tsx) - 基本使用範例
- [FormDialogExample.tsx](../../examples/FormDialogExample.tsx) - extraMethods 進階範例

## 重構改進

相比最初版本的改進：

1. **保持 React 慣例** - 使用標準的 `open` / `setOpen` 模式，零學習曲線
2. **簡單勝於複雜** - 用 `payload?.title` 而不是複雜的判別聯合型別
3. **保留所有有用功能** - `loading`, `dismissible`, `maxHeight`, `extraMethods` 都有實際用途
4. **清晰的職責分離** - 示範代碼移到 `examples/` 目錄
5. **擴展性** - 通過 `extraMethods` 支持自定義方法暴露
