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

type EventFormValues = {
  title: string;
  eventDate: Date | string;
  eventPeriod: DateRangeValue;
  eventDateTime: Date | string;
  eventDateTimeRange: DateTimeRangeValue;
  description: string;
};

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

export default function DatePickerExamples() {
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
          { before: new Date() },
          { dayOfWeek: [0, 6] },
        ],
      },
      {
        name: "eventPeriod",
        type: FIELD_TYPES.DATERANGE,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動期間",
        placeholder: "選擇活動期間",
        shortcuts: dateRangeShortcuts,
        disabledDates: { before: new Date() },
      },
      {
        name: "eventDateTime",
        type: FIELD_TYPES.DATETIME,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動日期時間",
        placeholder: "選擇活動日期時間",
        shortcuts: dateTimeShortcuts,
        disabledDates: { before: new Date() },
      },
      {
        name: "eventDateTimeRange",
        type: FIELD_TYPES.DATETIMERANGE,
        labelPosition: LABEL_POSITIONS.TOP,
        label: "活動日期時間區間",
        placeholder: "選擇活動日期時間區間",
        shortcuts: dateTimeRangeShortcuts,
        disabledDates: [
          { before: new Date() },
          { dayOfWeek: [0, 6] },
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
          { before: new Date() },
          { dayOfWeek: [0, 6] },
        ],
      },
      {
        name: "eventPeriod",
        type: FIELD_TYPES_NEW.DATERANGE,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動期間",
        placeholder: "選擇活動期間",
        shortcuts: dateRangeShortcuts,
        disabledDates: { before: new Date() },
      },
      {
        name: "eventDateTime",
        type: FIELD_TYPES_NEW.DATETIME,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動日期時間",
        placeholder: "選擇活動日期時間",
        shortcuts: dateTimeShortcuts,
        disabledDates: { before: new Date() },
      },
      {
        name: "eventDateTimeRange",
        type: FIELD_TYPES_NEW.DATETIMERANGE,
        labelPosition: LABEL_POSITIONS_NEW.TOP,
        label: "活動日期時間區間",
        placeholder: "選擇活動日期時間區間",
        shortcuts: dateTimeRangeShortcuts,
        disabledDates: [
          { before: new Date() },
          { dayOfWeek: [0, 6] },
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

  const handleEventSubmit = (data: EventFormValues) => {
    console.log("舊版 Event Form - Submitted data:", data);
  };

  const handleEventSubmitNew = (data: EventFormValues) => {
    console.log("新版 Event Form - Submitted data:", data);
  };

  return (
    <>
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
    </>
  );
}
