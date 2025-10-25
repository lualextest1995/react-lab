import { Button } from "@/components/ui/button";
import {
  FIELD_TYPES,
  Form,
  type FormConfig,
  LABEL_POSITIONS,
  type FormRef,
  when,
} from "@/components/Form";
import {
  AppForm,
  FIELD_TYPES as FIELD_TYPES_NEW,
  type FormConfig as FormConfigNew,
  LABEL_POSITIONS as LABEL_POSITIONS_NEW,
  type FormRef as FormRefNew,
  when as whenNew,
} from "@/components/Form/index1";
import { useState, useRef, useMemo } from "react";
import z from "zod";

type FormValues = {
  type: "canceled" | "ended";
  winOptionName?: string;
};

export default function VerticalFormExamples() {
  const [values, setValues] = useState<FormValues>({
    type: "canceled",
    winOptionName: "",
  });

  const [values2, setValues2] = useState<FormValues>({
    type: "canceled",
    winOptionName: "",
  });

  const formRef = useRef<FormRef>(null);
  const formRefNew = useRef<FormRefNew<FormValues>>(null);

  const betOptions = [
    { name: "Option A" },
    { name: "Option B" },
    { name: "Option C" },
  ];

  const schema = useMemo(() => {
    const baseSchema = {
      type: z.enum(["canceled", "ended"], "請選擇變更類型"),
    };
    if (values.type === "ended") {
      return z.object({
        ...baseSchema,
        winOptionName: z.string().min(1, "請選擇獲勝選項"),
      });
    }

    return z.object(baseSchema);
  }, [values.type]);

  const schemaNew = useMemo(() => {
    const baseSchema = {
      type: z.enum(["canceled", "ended"], "請選擇變更類型"),
    };
    if (values2.type === "ended") {
      return z.object({
        ...baseSchema,
        winOptionName: z.string().min(1, "請選擇獲勝選項"),
      });
    }

    return z.object(baseSchema);
  }, [values2.type]);

  const formConfig1: FormConfig = {
    fields: [
      {
        name: "type",
        type: FIELD_TYPES.SELECT,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "變更類型",
        className: "w-full",
        options: [
          {
            label: "canceled",
            value: "canceled",
          },
          {
            label: "ended",
            value: "ended",
          },
        ],
      },
      ...when(values.type === "ended", [
        {
          name: "winOptionName",
          type: FIELD_TYPES.SELECT,
          labelPosition: LABEL_POSITIONS.TOP,
          label: "獲勝選項",
          className: "w-full",
          options: betOptions.map((option) => ({
            label: option.name,
            value: option.name,
          })),
          helperText: "請選擇獲勝選項",
        },
      ]),
    ],
  };

  const formConfig1New: FormConfigNew<FormValues> = {
    fields: [
      {
        name: "type",
        type: FIELD_TYPES_NEW.SELECT,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "變更類型",
        className: "w-full",
        options: [
          {
            label: "canceled",
            value: "canceled",
          },
          {
            label: "ended",
            value: "ended",
          },
        ],
      },
      ...whenNew(values2.type === "ended", [
        {
          name: "winOptionName",
          type: FIELD_TYPES_NEW.SELECT,
          labelPosition: LABEL_POSITIONS_NEW.TOP,
          label: "獲勝選項",
          className: "w-full",
          options: betOptions.map((option) => ({
            label: option.name,
            value: option.name,
          })),
          helperText: "請選擇獲勝選項",
        },
      ]),
    ],
  };

  const handleSubmit1 = (data: FormValues) => {
    console.log("舊版 Form with Zod Schema - Submitted data:", data);
  };

  const handleSubmit1New = (data: FormValues) => {
    console.log("新版 AppForm with Zod Schema - Submitted data:", data);
  };

  const handleExternalSubmitWithRef = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handleExternalSubmitWithRefNew = () => {
    if (formRefNew.current) {
      formRefNew.current.submit();
    }
  };

  return (
    <>
      {/* 舊版垂直表單 with Zod Schema */}
      <div className="w-full max-w-xs border rounded-lg p-6 bg-slate-50">
        <h2 className="text-xl font-bold mb-4 text-slate-700">
          舊版 Form (垂直表單 + Zod Schema + Ref)
        </h2>
        <Form
          ref={formRef}
          config={formConfig1}
          values={values}
          schema={schema}
          onChange={setValues}
          onSubmit={handleSubmit1}
          className="space-y-4 mx-auto w-[280px]"
        />
        <div className="flex justify-center mt-4">
          <Button onClick={handleExternalSubmitWithRef}>
            外部提交 (使用 Ref)
          </Button>
        </div>
      </div>

      {/* 新版垂直表單 with Zod Schema */}
      <div className="w-full max-w-xs border rounded-lg p-6 bg-blue-50">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          新版 AppForm (垂直表單 + Zod Schema + Ref)
        </h2>
        <AppForm
          ref={formRefNew}
          config={formConfig1New}
          values={values2}
          schema={schemaNew}
          onChange={setValues2}
          onSubmit={handleSubmit1New}
          className="space-y-4 mx-auto w-[280px]"
        />
        <div className="flex justify-center mt-4">
          <Button onClick={handleExternalSubmitWithRefNew}>
            外部提交 (使用 Ref)
          </Button>
        </div>
      </div>
    </>
  );
}
