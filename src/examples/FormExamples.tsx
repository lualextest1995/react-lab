import { Button } from "@/components/ui/button";
import {
  FIELD_TYPES,
  Form,
  type FormConfig,
  LABEL_POSITIONS,
} from "@/components/Form";
import {
  AppForm,
  FIELD_TYPES as FIELD_TYPES_NEW,
  type FormConfig as FormConfigNew,
  LABEL_POSITIONS as LABEL_POSITIONS_NEW,
} from "@/components/Form/index1";
import { useState } from "react";

type ContestListValues = {
  title: string;
  creator: string;
  status: "all" | ContestStatus;
};

type ContestStatus =
  | "ongoing"
  | "awaiting"
  | "pending"
  | "disputed"
  | "ended"
  | "canceled";

export default function FormExamples() {
  const [formData, setFormData] = useState<ContestListValues>({
    title: "",
    creator: "",
    status: "all",
  });

  const [formData2, setFormData2] = useState<ContestListValues>({
    title: "",
    creator: "",
    status: "all",
  });

  const formConfig: FormConfig = {
    fields: [
      {
        name: "title",
        type: FIELD_TYPES.TEXT,
        labelPosition: LABEL_POSITIONS.LEFT,
        label: "標題",
        placeholder: "請輸入標題",
        className: "w-40",
      },
      {
        name: "creator",
        type: FIELD_TYPES.TEXT,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "建立者",
        placeholder: "請輸入建立者",
        className: "w-40",
      },
      {
        name: "status",
        type: FIELD_TYPES.SELECT,
        labelPosition: LABEL_POSITIONS.INLINE,
        label: "狀態",
        options: [
          { label: "全部", value: "all" },
          { label: "ongoing", value: "ongoing" },
          { label: "awaiting", value: "awaiting" },
          { label: "pending", value: "pending" },
          { label: "disputed", value: "disputed" },
          { label: "ended", value: "ended" },
          { label: "canceled", value: "canceled" },
        ],
        placeholder: "請選擇狀態",
        className: "w-40",
      },
    ],
  };

  const formConfigNew: FormConfigNew<ContestListValues> = {
    fields: [
      {
        name: "title",
        type: FIELD_TYPES_NEW.TEXT,
        labelPosition: LABEL_POSITIONS_NEW.LEFT,
        label: "標題",
        placeholder: "請輸入標題",
        className: "w-40",
      },
      {
        name: "creator",
        type: FIELD_TYPES_NEW.TEXT,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "建立者",
        placeholder: "請輸入建立者",
        className: "w-40",
      },
      {
        name: "status",
        type: FIELD_TYPES_NEW.SELECT,
        labelPosition: LABEL_POSITIONS_NEW.INLINE,
        label: "狀態",
        options: [
          { label: "全部", value: "all" },
          { label: "ongoing", value: "ongoing" },
          { label: "awaiting", value: "awaiting" },
          { label: "pending", value: "pending" },
          { label: "disputed", value: "disputed" },
          { label: "ended", value: "ended" },
          { label: "canceled", value: "canceled" },
        ],
        placeholder: "請選擇狀態",
        className: "w-40",
      },
    ],
  };

  const handleSubmit = (data: ContestListValues) => {
    console.log("舊版 Form - Submitted data:", data);
  };

  const handleSubmitNew = (data: ContestListValues) => {
    console.log("新版 AppForm - Submitted data:", data);
  };

  return (
    <>
      {/* 舊版 Form */}
      <div className="w-full max-w-4xl border rounded-lg p-6 bg-slate-50">
        <h2 className="text-xl font-bold mb-4 text-slate-700">
          舊版 Form (index.tsx)
        </h2>
        <Form
          config={formConfig}
          values={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          className="flex gap-3 flex-wrap items-center"
        >
          <div className="flex gap-2 ml-auto flex-wrap">
            <Button type="submit">搜尋</Button>
          </div>
        </Form>
      </div>

      {/* 新版 AppForm */}
      <div className="w-full max-w-4xl border rounded-lg p-6 bg-blue-50">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          新版 AppForm (index1.tsx - with Shadcn UI)
        </h2>
        <AppForm
          config={formConfigNew}
          values={formData2}
          onChange={setFormData2}
          onSubmit={handleSubmitNew}
          className="flex gap-3 flex-wrap items-center"
        >
          <div className="flex gap-2 ml-auto flex-wrap">
            <Button type="submit">搜尋</Button>
          </div>
        </AppForm>
      </div>
    </>
  );
}
