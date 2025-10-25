import { Button } from "@/components/ui/button";
import { login } from "./apis/user";
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
import type { DateShortcut } from "@/components/DatePicker";
import type {
  DateRangeShortcut,
  DateRangeValue,
} from "@/components/DateRangePicker";
import type { DateTimeShortcut } from "@/components/DateTimePicker";
import type {
  DateTimeRangeShortcut,
  DateTimeRangeValue,
} from "@/components/DateTimeRangePicker";
import DialogExamples from "./examples/DialogExamples";

const eventDateShortcuts: DateShortcut[] = [
  { label: "今天", date: new Date() },
  {
    label: "明天",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
  {
    label: "後天",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
  },
  {
    label: "下週一",
    date: new Date(
      new Date().setDate(
        new Date().getDate() + ((1 + 7 - new Date().getDay()) % 7 || 7)
      )
    ),
  },
  {
    label: "下個月",
    date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  },
];

const dateRangeShortcuts: DateRangeShortcut[] = [
  {
    label: "今天",
    range: { from: new Date(), to: new Date() },
  },
  {
    label: "最近 7 天",
    range: {
      from: new Date(new Date().setDate(new Date().getDate() - 6)),
      to: new Date(),
    },
  },
  {
    label: "最近 30 天",
    range: {
      from: new Date(new Date().setDate(new Date().getDate() - 29)),
      to: new Date(),
    },
  },
  {
    label: "本月",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
  },
  {
    label: "上個月",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
  },
];

const dateTimeShortcuts: DateTimeShortcut[] = [
  { label: "現在", dateTime: new Date() },
  {
    label: "1小時後",
    dateTime: new Date(new Date().getTime() + 60 * 60 * 1000),
  },
  {
    label: "明天此時",
    dateTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  },
  {
    label: "下週此時",
    dateTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  },
];

const dateTimeRangeShortcuts: DateTimeRangeShortcut[] = [
  {
    label: "今天",
    range: {
      from: new Date(new Date().setHours(0, 0, 0, 0)),
      to: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  },
  {
    label: "最近 24 小時",
    range: {
      from: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  },
  {
    label: "最近 7 天",
    range: {
      from: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  },
  {
    label: "本週",
    range: {
      from: new Date(
        new Date().setDate(new Date().getDate() - new Date().getDay())
      ),
      to: new Date(),
    },
  },
];

type ContestStatus =
  | "ongoing"
  | "awaiting"
  | "pending"
  | "disputed"
  | "ended"
  | "canceled";

type ContestListValues = {
  title: string;
  creator: string;
  status: "all" | ContestStatus;
};

type FormValues = {
  type: "canceled" | "ended";
  winOptionName?: string;
};

type FeedbackFormValues = {
  name: string;
  email: string;
  message: string;
};

type EventFormValues = {
  title: string;
  eventDate: Date | string;
  eventPeriod: DateRangeValue;
  eventDateTime: Date | string;
  eventDateTimeRange: DateTimeRangeValue;
  description: string;
};

export default function App() {
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

  const [values, setValues] = useState<FormValues>({
    type: "canceled",
    winOptionName: "",
  });

  const [values2, setValues2] = useState<FormValues>({
    type: "canceled",
    winOptionName: "",
  });

  const [feedback, setFeedback] = useState<FeedbackFormValues>({
    name: "",
    email: "",
    message: "",
  });

  const [feedbackNew, setFeedbackNew] = useState<FeedbackFormValues>({
    name: "",
    email: "",
    message: "",
  });

  const [event, setEvent] = useState<EventFormValues>({
    title: "",
    eventDate: new Date(),
    eventPeriod: [undefined, undefined],
    eventDateTime: new Date(),
    eventDateTimeRange: [undefined, undefined],
    description: "",
  });

  const [eventNew, setEventNew] = useState<EventFormValues>({
    title: "",
    eventDate: new Date(),
    eventPeriod: [undefined, undefined],
    eventDateTime: new Date(),
    eventDateTimeRange: [undefined, undefined],
    description: "",
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

  const feedbackFormConfig: FormConfig = {
    fields: [
      {
        name: "name",
        type: FIELD_TYPES.TEXT,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "姓名",
        placeholder: "請輸入您的姓名",
      },
      {
        name: "email",
        type: FIELD_TYPES.TEXT,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "Email",
        placeholder: "your@email.com",
      },
      {
        name: "message",
        type: FIELD_TYPES.TEXTAREA,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "訊息",
        placeholder: "請輸入您的意見回饋...",
        rows: 5,
      },
    ],
  };

  const feedbackFormConfigNew: FormConfigNew<FeedbackFormValues> = {
    fields: [
      {
        name: "name",
        type: FIELD_TYPES_NEW.TEXT,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "姓名",
        placeholder: "請輸入您的姓名",
      },
      {
        name: "email",
        type: FIELD_TYPES_NEW.TEXT,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "Email",
        placeholder: "your@email.com",
      },
      {
        name: "message",
        type: FIELD_TYPES_NEW.TEXTAREA,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "訊息",
        placeholder: "請輸入您的意見回饋...",
        rows: 5,
      },
    ],
  };

  const eventFormConfig: FormConfig = {
    fields: [
      {
        name: "title",
        type: FIELD_TYPES.TEXT,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動標題",
        placeholder: "請輸入活動標題",
      },
      {
        name: "eventDate",
        type: FIELD_TYPES.DATEPICKER,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動日期",
        placeholder: "選擇活動日期",
        shortcuts: eventDateShortcuts,
        disabledDates: [
          { before: new Date() }, // 不可選擇過去的日期
          { dayOfWeek: [0, 6] }, // 不可選擇週末
        ],
      },
      {
        name: "eventPeriod",
        type: FIELD_TYPES.DATERANGE,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動期間",
        placeholder: "選擇活動期間",
        shortcuts: dateRangeShortcuts,
        disabledDates: { before: new Date() }, // 不可選擇過去的日期
      },
      {
        name: "eventDateTime",
        type: FIELD_TYPES.DATETIME,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動日期時間",
        placeholder: "選擇活動日期時間",
        shortcuts: dateTimeShortcuts,
        disabledDates: { before: new Date() }, // 不可選擇過去的日期
      },
      {
        name: "eventDateTimeRange",
        type: FIELD_TYPES.DATETIMERANGE,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動日期時間區間",
        placeholder: "選擇活動日期時間區間",
        shortcuts: dateTimeRangeShortcuts,
        disabledDates: [
          { before: new Date() }, // 不可選擇過去的日期
          { dayOfWeek: [0, 6] }, // 不可選擇週末
        ],
      },
      {
        name: "description",
        type: FIELD_TYPES.TEXTAREA,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動描述",
        placeholder: "請輸入活動描述...",
        rows: 4,
      },
    ],
  };

  const eventFormConfigNew: FormConfigNew<EventFormValues> = {
    fields: [
      {
        name: "title",
        type: FIELD_TYPES_NEW.TEXT,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動標題",
        placeholder: "請輸入活動標題",
      },
      {
        name: "eventDate",
        type: FIELD_TYPES_NEW.DATEPICKER,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動日期",
        placeholder: "選擇活動日期",
        shortcuts: eventDateShortcuts,
        disabledDates: [
          { before: new Date() }, // 不可選擇過去的日期
          { dayOfWeek: [0, 6] }, // 不可選擇週末
        ],
      },
      {
        name: "eventPeriod",
        type: FIELD_TYPES_NEW.DATERANGE,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動期間",
        placeholder: "選擇活動期間",
        shortcuts: dateRangeShortcuts,
        disabledDates: { before: new Date() }, // 不可選擇過去的日期
      },
      {
        name: "eventDateTime",
        type: FIELD_TYPES_NEW.DATETIME,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動日期時間",
        placeholder: "選擇活動日期時間",
        shortcuts: dateTimeShortcuts,
        disabledDates: { before: new Date() }, // 不可選擇過去的日期
      },
      {
        name: "eventDateTimeRange",
        type: FIELD_TYPES_NEW.DATETIMERANGE,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動日期時間區間",
        placeholder: "選擇活動日期時間區間",
        shortcuts: dateTimeRangeShortcuts,
        disabledDates: [
          { before: new Date() }, // 不可選擇過去的日期
          { dayOfWeek: [0, 6] }, // 不可選擇週末
        ],
      },
      {
        name: "description",
        type: FIELD_TYPES_NEW.TEXTAREA,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動描述",
        placeholder: "請輸入活動描述...",
        rows: 4,
      },
    ],
  };

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

  const handleSubmit = (data: ContestListValues) => {
    console.log("舊版 Form - Submitted data:", data);
  };

  const handleSubmit1 = (data: FormValues) => {
    console.log("舊版 Form with Zod Schema - Submitted data:", data);
  };

  const handleSubmit1New = (data: FormValues) => {
    console.log("新版 AppForm with Zod Schema - Submitted data:", data);
  };

  const handleFeedbackSubmit = (data: FeedbackFormValues) => {
    console.log("舊版 Feedback Form - Submitted data:", data);
  };

  const handleFeedbackSubmitNew = (data: FeedbackFormValues) => {
    console.log("新版 Feedback Form - Submitted data:", data);
  };

  const handleEventSubmit = (data: EventFormValues) => {
    console.log("舊版 Event Form - Submitted data:", data);
  };

  const handleEventSubmitNew = (data: EventFormValues) => {
    console.log("新版 Event Form - Submitted data:", data);
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

  const handleSubmitNew = (data: ContestListValues) => {
    console.log("新版 AppForm - Submitted data:", data);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <DialogExamples />
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
      <hr className="w-full" />

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

      <hr className="w-full" />

      {/* Textarea 範例 - 舊版 */}
      <div className="w-full max-w-md border rounded-lg p-6 bg-slate-50">
        <h2 className="text-xl font-bold mb-4 text-slate-700">
          舊版 Form (Textarea 範例)
        </h2>
        <Form
          config={feedbackFormConfig}
          values={feedback}
          onChange={setFeedback}
          onSubmit={handleFeedbackSubmit}
          className="space-y-4"
        >
          <Button type="submit" className="w-full">
            送出回饋
          </Button>
        </Form>
      </div>

      {/* Textarea 範例 - 新版 */}
      <div className="w-full max-w-md border rounded-lg p-6 bg-blue-50">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          新版 AppForm (Textarea 範例)
        </h2>
        <AppForm
          config={feedbackFormConfigNew}
          values={feedbackNew}
          onChange={setFeedbackNew}
          onSubmit={handleFeedbackSubmitNew}
          className="space-y-4"
        >
          <Button type="submit" className="w-full">
            送出回饋
          </Button>
        </AppForm>
      </div>

      <hr className="w-full" />

      {/* DatePicker 範例 - 舊版 */}
      <div className="w-full max-w-md border rounded-lg p-6 bg-slate-50">
        <h2 className="text-xl font-bold mb-4 text-slate-700">
          舊版 Form (DatePicker 範例)
        </h2>
        <Form
          config={eventFormConfig}
          values={event}
          onChange={setEvent}
          onSubmit={handleEventSubmit}
          className="space-y-4"
        >
          <Button type="submit" className="w-full">
            建立活動
          </Button>
        </Form>
      </div>

      {/* DatePicker 範例 - 新版 */}
      <div className="w-full max-w-md border rounded-lg p-6 bg-blue-50">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          新版 AppForm (DatePicker 範例)
        </h2>
        <AppForm
          config={eventFormConfigNew}
          values={eventNew}
          onChange={setEventNew}
          onSubmit={handleEventSubmitNew}
          className="space-y-4"
        >
          <Button type="submit" className="w-full">
            建立活動
          </Button>
        </AppForm>
      </div>

      <Button onClick={handleLogin}>Click me</Button>
    </div>
  );
}
