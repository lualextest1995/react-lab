import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  FormProvider,
  type Path,
  useForm,
  useFormContext,
} from "react-hook-form";
import type z from "zod";
import AppInput from "@/components/Input";
import AppSelect from "@/components/Select";
import AppTextarea from "@/components/Textarea";
import AppDatePicker from "@/components/DatePicker";
import AppDateRangePicker from "@/components/DateRangePicker";
import AppDateTimePicker from "@/components/DateTimePicker";
import AppDateTimeRangePicker from "@/components/DateTimeRangePicker";

// 直接從你的元件提取 Option 類型
export type SelectOption = {
  isGroup?: boolean;
  value: string;
  label: string;
  children?: SelectOption[];
  disabled?: boolean;
};

// 共用基礎
type BaseFieldConfig = {
  name: string; // 對應 zod schema 的 key
  helperText?: string; // 輔助說明文字
  className?: string; // 自訂樣式類別
};

// Text Input
export type TextInputConfig = BaseFieldConfig & {
  type: "text";
  labelPosition?: LabelPosition;
} & Omit<ComponentProps<typeof AppInput>, "labelPosition">;

// Password Input
export type PasswordInputConfig = BaseFieldConfig & {
  type: "password";
  labelPosition?: LabelPosition;
} & Omit<ComponentProps<typeof AppInput>, "labelPosition">;

// Textarea
export type TextareaConfig = BaseFieldConfig & {
  type: "textarea";
  labelPosition?: LabelPosition;
} & Omit<ComponentProps<typeof AppTextarea>, "labelPosition">;

// DatePicker
export type DatePickerConfig = BaseFieldConfig & {
  type: "datepicker";
  labelPosition?: LabelPosition;
} & Omit<ComponentProps<typeof AppDatePicker>, "labelPosition">;

// DateRangePicker
export type DateRangePickerConfig = BaseFieldConfig & {
  type: "daterange";
  labelPosition?: LabelPosition;
} & Omit<ComponentProps<typeof AppDateRangePicker>, "labelPosition">;

// DateTimePicker
export type DateTimePickerConfig = BaseFieldConfig & {
  type: "datetime";
  labelPosition?: LabelPosition;
} & Omit<ComponentProps<typeof AppDateTimePicker>, "labelPosition">;

// DateTimeRangePicker
export type DateTimeRangePickerConfig = BaseFieldConfig & {
  type: "datetimerange";
  labelPosition?: LabelPosition;
} & Omit<ComponentProps<typeof AppDateTimeRangePicker>, "labelPosition">;

// Select
export type SelectConfig = BaseFieldConfig & {
  type: "select";
  labelPosition?: LabelPosition;
} & Omit<
    ComponentProps<typeof AppSelect>,
    "onChange" | "defaultValue" | "labelPosition"
  >;

// 組合
export type FieldConfig =
  | TextInputConfig
  | PasswordInputConfig
  | TextareaConfig
  | DatePickerConfig
  | DateRangePickerConfig
  | DateTimePickerConfig
  | DateTimeRangePickerConfig
  | SelectConfig;

export type FormConfig = {
  fields: FieldConfig[];
};

// 表單實例的控制方法
export type FormRef = {
  submit: () => void;
  getValues: () => Record<string, unknown>;
  setValue: (name: string, value: unknown) => void;
};

export type FormProps<TValues extends Record<string, unknown>> = {
  config: FormConfig;
  schema?: z.ZodSchema<TValues>;
  values: TValues;
  onChange: (values: TValues) => void;
  onSubmit: (data: TValues) => void;
  className?: string;
  children?: React.ReactNode;
};

export function FormField({ config }: { config: FieldConfig }) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const error = errors[config.name];
  const { name, helperText, className, type, labelPosition, ...restConfig } =
    config;
  const isLeftLayout = labelPosition === "left";
  const messageClassName = isLeftLayout ? "ml-[calc(22%+0.75rem)]" : "";

  // Text Input
  if (type === "text") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rows, ...inputConfig } = restConfig as typeof restConfig & { rows?: number };
    const registered = register(name);
    const inputProps = {
      ...registered,
      labelPosition,
      className: error ? "border-destructive" : "",
      ...inputConfig,
    };
    return (
      <div className={className}>
        <AppInput {...(inputProps as React.ComponentProps<typeof AppInput>)} />

        {/* 錯誤訊息 - 紅色 */}
        {error && (
          <p className={`text-sm text-destructive mt-1 ${messageClassName}`}>
            {error.message as string}
          </p>
        )}

        {/* Helper Text - 灰色 */}
        {helperText && !error && (
          <p
            className={`text-muted-foreground mt-1 text-xs ${messageClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // Password Input
  if (type === "password") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rows, ...inputConfig } = restConfig as typeof restConfig & { rows?: number };
    const registered = register(name);
    const inputProps = {
      ...registered,
      type: "password" as const,
      labelPosition,
      className: error ? "border-destructive" : "",
      ...inputConfig,
    };
    return (
      <div className={className}>
        <AppInput {...(inputProps as React.ComponentProps<typeof AppInput>)} />

        {/* 錯誤訊息 - 紅色 */}
        {error && (
          <p className={`text-sm text-destructive mt-1 ${messageClassName}`}>
            {error.message as string}
          </p>
        )}

        {/* Helper Text - 灰色 */}
        {helperText && !error && (
          <p
            className={`text-muted-foreground mt-1 text-xs ${messageClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // Textarea
  if (type === "textarea") {
    const registered = register(name);
    const textareaProps = {
      ...registered,
      labelPosition,
      className: error ? "border-destructive" : "",
      ...restConfig,
    };
    return (
      <div className={className}>
        <AppTextarea {...(textareaProps as React.ComponentProps<typeof AppTextarea>)} />

        {/* 錯誤訊息 - 紅色 */}
        {error && (
          <p className={`text-sm text-destructive mt-1 ${messageClassName}`}>
            {error.message as string}
          </p>
        )}

        {/* Helper Text - 灰色 */}
        {helperText && !error && (
          <p
            className={`text-muted-foreground mt-1 text-xs ${messageClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // DatePicker
  if (type === "datepicker") {
    const value = watch(name) as Date | string | undefined;
    const handleDateChange = (date: string | undefined) => {
      setValue(name, date);
    };

    const datepickerProps = {
      value,
      onChange: handleDateChange,
      labelPosition,
      className: error ? "border-destructive" : "",
      ...restConfig,
    };

    return (
      <div className={className}>
        <AppDatePicker {...(datepickerProps as React.ComponentProps<typeof AppDatePicker>)} />

        {/* 錯誤訊息 - 紅色 */}
        {error && (
          <p className={`text-sm text-destructive mt-1 ${messageClassName}`}>
            {error.message as string}
          </p>
        )}

        {/* Helper Text - 灰色 */}
        {helperText && !error && (
          <p
            className={`text-muted-foreground mt-1 text-xs ${messageClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // DateRangePicker
  if (type === "daterange") {
    const value = watch(name) as import("react-day-picker").DateRange | undefined;
    const handleDateRangeChange = (range: import("react-day-picker").DateRange | undefined) => {
      setValue(name, range);
    };

    const dateRangePickerProps = {
      value,
      onChange: handleDateRangeChange,
      labelPosition,
      className: error ? "border-destructive" : "",
      ...restConfig,
    };

    return (
      <div className={className}>
        <AppDateRangePicker {...(dateRangePickerProps as React.ComponentProps<typeof AppDateRangePicker>)} />

        {/* 錯誤訊息 - 紅色 */}
        {error && (
          <p className={`text-sm text-destructive mt-1 ${messageClassName}`}>
            {error.message as string}
          </p>
        )}

        {/* Helper Text - 灰色 */}
        {helperText && !error && (
          <p
            className={`text-muted-foreground mt-1 text-xs ${messageClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // DateTimePicker
  if (type === "datetime") {
    const value = watch(name) as Date | string | undefined;
    const handleDateTimeChange = (dateTime: Date | string | undefined) => {
      setValue(name, dateTime);
    };

    const dateTimePickerProps = {
      value,
      onChange: handleDateTimeChange,
      labelPosition,
      className: error ? "border-destructive" : "",
      ...restConfig,
    };

    return (
      <div className={className}>
        <AppDateTimePicker {...(dateTimePickerProps as React.ComponentProps<typeof AppDateTimePicker>)} />

        {/* 錯誤訊息 - 紅色 */}
        {error && (
          <p className={`text-sm text-destructive mt-1 ${messageClassName}`}>
            {error.message as string}
          </p>
        )}

        {/* Helper Text - 灰色 */}
        {helperText && !error && (
          <p
            className={`text-muted-foreground mt-1 text-xs ${messageClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // DateTimeRangePicker
  if (type === "datetimerange") {
    const value = watch(name) as import("@/components/DateTimeRangePicker").DateTimeRangeValue | undefined;
    const handleDateTimeRangeChange = (range: import("@/components/DateTimeRangePicker").DateTimeRangeValue | undefined) => {
      setValue(name, range);
    };

    const dateTimeRangePickerProps = {
      value,
      onChange: handleDateTimeRangeChange,
      labelPosition,
      className: error ? "border-destructive" : "",
      ...restConfig,
    };

    return (
      <div className={className}>
        <AppDateTimeRangePicker {...(dateTimeRangePickerProps as React.ComponentProps<typeof AppDateTimeRangePicker>)} />

        {/* 錯誤訊息 - 紅色 */}
        {error && (
          <p className={`text-sm text-destructive mt-1 ${messageClassName}`}>
            {error.message as string}
          </p>
        )}

        {/* Helper Text - 灰色 */}
        {helperText && !error && (
          <p
            className={`text-muted-foreground mt-1 text-xs ${messageClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  // Select
  if (type === "select") {
    const value = watch(name) || "";

    return (
      <div className={className}>
        <AppSelect
          {...(restConfig as Omit<
            ComponentProps<typeof AppSelect>,
            "onChange" | "defaultValue" | "labelPosition"
          >)}
          labelPosition={labelPosition}
          value={value}
          onChange={(val) => setValue(name, val)}
          className={error ? "border-destructive" : ""}
        />

        {/* 錯誤訊息 - 紅色 */}
        {error && (
          <p className={`text-sm text-destructive mt-1 ${messageClassName}`}>
            {error.message as string}
          </p>
        )}

        {/* Helper Text - 灰色 */}
        {helperText && !error && (
          <p
            className={`text-muted-foreground mt-1 text-xs ${messageClassName}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }

  return null;
}

// 表單組件 - 支持泛型和 ref
export const Form = forwardRef(function Form<
  TValues extends Record<string, unknown>
>(
  {
    config,
    schema,
    values,
    onChange,
    onSubmit,
    className,
    children,
  }: FormProps<TValues>,
  ref: React.Ref<FormRef>
) {
  const methods = useForm({
    // @ts-expect-error - Zod v4 compatibility issue with zodResolver types
    resolver: schema ? zodResolver(schema) : undefined,
    values,
    mode: "onChange",
  });

  // 暴露表單控制方法給父組件
  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        methods.handleSubmit((data) => onSubmit(data as TValues))();
      },
      getValues: () => methods.getValues(),
      setValue: (name: string, value: unknown) => {
        // 使用 Path<TValues> 來確保類型安全
        methods.setValue(name as Path<TValues>, value as never);
      },
    }),
    [methods, onSubmit]
  );

  // 監聽表單變化，同步到外部
  useEffect(() => {
    const subscription = methods.watch((data) => {
      onChange(data as TValues);
    });
    return () => subscription.unsubscribe();
  }, [methods, onChange]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => onSubmit(data as TValues))}
        className={className}
      >
        {config.fields.map((fieldConfig) => (
          <FormField key={fieldConfig.name} config={fieldConfig} />
        ))}

        {/* 渲染 children */}
        {children}
      </form>
    </FormProvider>
  );
}) as <TValues extends Record<string, unknown>>(
  props: FormProps<TValues> & { ref?: React.Ref<FormRef> }
) => React.ReactElement;

// ============================================
// AppForm Constants - 共用常數和類型定義
// ============================================

export const FIELD_TYPES = {
  TEXT: "text",
  PASSWORD: "password",
  TEXTAREA: "textarea",
  DATEPICKER: "datepicker",
  DATERANGE: "daterange",
  DATETIME: "datetime",
  DATETIMERANGE: "datetimerange",
  SELECT: "select",
} as const;

export const LABEL_POSITIONS = {
  INLINE: "inline",
  TOP: "top",
  LEFT: "left",
  NONE: "none",
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];
export type LabelPosition =
  (typeof LABEL_POSITIONS)[keyof typeof LABEL_POSITIONS];

/**
 * 條件性加入 fields 的 helper function
 */
export function when<T>(condition: boolean, fields: T[]): T[] {
  return condition ? fields : [];
}
