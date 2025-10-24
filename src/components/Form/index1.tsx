"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import type z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import AppInput from "@/components/Input";
import AppSelect from "@/components/Select";
import AppTextarea from "@/components/Textarea";
import AppDatePicker from "@/components/DatePicker";
import AppDateRangePicker from "@/components/DateRangePicker";
import AppDateTimePicker from "@/components/DateTimePicker";
import AppDateTimeRangePicker from "@/components/DateTimeRangePicker";

// ============================================
// 🧩 類型定義區
// ============================================

export type SelectOption = {
  isGroup?: boolean;
  value: string;
  label: string;
  children?: SelectOption[];
  disabled?: boolean;
};

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
 * 使用 const assertion 保持字面類型
 */
export function when<const T extends readonly unknown[]>(
  condition: boolean,
  fields: T
): T | [] {
  return condition ? fields : ([] as const);
}

type ZodFieldValuesSchema<TValues extends FieldValues> = z.ZodType<
  TValues,
  FieldValues
>;

/**
 * 基礎欄位配置 - 只關心資料和 UI
 */
interface BaseFieldConfig<TValues extends FieldValues> {
  name: FieldPath<TValues>;
  label?: string;
  helperText?: string;
  labelPosition?: LabelPosition;
  className?: string;
  controlClassName?: string;
  inputClassName?: string;
}

/**
 * 文字輸入欄位
 */
export type TextInputConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "text";
  placeholder?: string;
};

/**
 * 密碼輸入欄位
 */
export type PasswordInputConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "password";
  placeholder?: string;
};

/**
 * 文字區域欄位
 */
export type TextareaConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "textarea";
  placeholder?: string;
  rows?: number;
};

/**
 * 日期選擇器欄位
 */
export type DatePickerConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "datepicker";
  placeholder?: string;
  shortcuts?: import("@/components/DatePicker").DateShortcut[];
  disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
};

/**
 * 日期區間選擇器欄位
 */
export type DateRangePickerConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "daterange";
  placeholder?: string;
  shortcuts?: import("@/components/DateRangePicker").DateRangeShortcut[];
  disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
};

/**
 * 日期時間選擇器欄位
 */
export type DateTimePickerConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "datetime";
  placeholder?: string;
  shortcuts?: import("@/components/DateTimePicker").DateTimeShortcut[];
  disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
};

/**
 * 日期時間區間選擇器欄位
 */
export type DateTimeRangePickerConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "datetimerange";
  placeholder?: string;
  shortcuts?: import("@/components/DateTimeRangePicker").DateTimeRangeShortcut[];
  disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
};

/**
 * 下拉選單欄位
 */
export type SelectConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "select";
  options: SelectOption[];
  placeholder?: string;
};

export type FieldConfig<TValues extends FieldValues> =
  | TextInputConfig<TValues>
  | PasswordInputConfig<TValues>
  | TextareaConfig<TValues>
  | DatePickerConfig<TValues>
  | DateRangePickerConfig<TValues>
  | DateTimePickerConfig<TValues>
  | DateTimeRangePickerConfig<TValues>
  | SelectConfig<TValues>;

export interface FormConfig<TValues extends FieldValues> {
  fields: FieldConfig<TValues>[];
}

export interface FormRef<TValues extends FieldValues> {
  submit: () => void;
  getValues: () => TValues;
  setValue: <K extends FieldPath<TValues>>(name: K, value: TValues[K]) => void;
}

export interface AppFormProps<TValues extends FieldValues> {
  config: FormConfig<TValues>;
  schema?: ZodFieldValuesSchema<TValues>;
  values: TValues;
  onChange: (values: TValues) => void;
  onSubmit: (data: TValues) => void;
  className?: string;
  children?: React.ReactNode;
}

// ============================================
// 🧱 AppForm (Type-safe + Shadcn)
// ============================================

export const AppForm = forwardRef(function AppForm<TValues extends FieldValues>(
  {
    config,
    schema,
    values,
    onChange,
    onSubmit,
    className,
    children,
  }: AppFormProps<TValues>,
  ref: React.Ref<FormRef<TValues>>
) {
  const form = useForm<TValues, unknown, TValues>({
    resolver: schema
      ? (zodResolver(schema) as unknown as Resolver<
          TValues,
          unknown,
          TValues
        >)
      : undefined,
    defaultValues: values as DefaultValues<TValues>,
    mode: "onChange",
  });

  // ✅ 外部控制 ref
  useImperativeHandle(ref, () => ({
    submit: () => form.handleSubmit(onSubmit)(),
    getValues: () => form.getValues(),
    setValue: (name, value) => form.setValue(name, value),
  }));

  // ✅ 雙向同步
  useEffect(() => {
    const subscription = form.watch(() => onChange(form.getValues()));
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // ✅ 清除不存在欄位的錯誤
  useEffect(() => {
    const currentFieldNames = new Set(config.fields.map((f) => f.name));
    const formState = form.formState;

    // 清除不在當前 config 中的欄位錯誤
    Object.keys(formState.errors).forEach((fieldName) => {
      if (!currentFieldNames.has(fieldName as never)) {
        form.clearErrors(fieldName as never);
      }
    });
  }, [config.fields, form]);

  // ============================================
  // 🔧 Helper Functions - 單一職責原則
  // ============================================

  /**
   * 標準化欄位值 - 統一處理類型轉換
   */
  const normalizeFieldValue = (value: unknown, type: FieldType): string | undefined => {
    if (type === "select") {
      return value == null ? undefined : String(value);
    }
    return value == null ? "" : String(value);
  };

  /**
   * 渲染輸入元件 - 只負責選擇正確的 input
   */
  const renderInput = (
    fieldConfig: FieldConfig<TValues>,
    field: { value: unknown; onChange: (value: unknown) => void },
    errorClassName: string
  ) => {
    const { type, inputClassName, placeholder } = fieldConfig;

    // TypeScript 類型窄化 - 當 type === "select" 時,TypeScript 知道這是 SelectConfig
    if (type === "select") {
      // 類型守衛:確保只有 SelectConfig 才有 options
      if (!("options" in fieldConfig)) return null;

      return (
        <AppSelect
          options={fieldConfig.options}
          placeholder={placeholder}
          value={normalizeFieldValue(field.value, type)}
          onChange={field.onChange}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "textarea") {
      const rows = "rows" in fieldConfig ? fieldConfig.rows : undefined;
      return (
        <AppTextarea
          placeholder={placeholder}
          rows={rows}
          value={normalizeFieldValue(field.value, type)}
          onChange={field.onChange}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "datepicker") {
      const shortcuts = "shortcuts" in fieldConfig ? fieldConfig.shortcuts : undefined;
      const disabledDates = "disabledDates" in fieldConfig ? fieldConfig.disabledDates : undefined;
      return (
        <AppDatePicker
          placeholder={placeholder}
          value={field.value as Date | string | undefined}
          onChange={field.onChange}
          shortcuts={shortcuts}
          disabledDates={disabledDates}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "daterange") {
      const shortcuts = "shortcuts" in fieldConfig ? fieldConfig.shortcuts : undefined;
      const disabledDates = "disabledDates" in fieldConfig ? fieldConfig.disabledDates : undefined;
      return (
        <AppDateRangePicker
          placeholder={placeholder}
          value={field.value as import("react-day-picker").DateRange | undefined}
          onChange={field.onChange}
          shortcuts={shortcuts}
          disabledDates={disabledDates}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "datetime") {
      const shortcuts = "shortcuts" in fieldConfig ? fieldConfig.shortcuts : undefined;
      const disabledDates = "disabledDates" in fieldConfig ? fieldConfig.disabledDates : undefined;
      return (
        <AppDateTimePicker
          placeholder={placeholder}
          value={field.value as Date | string | undefined}
          onChange={field.onChange}
          shortcuts={shortcuts}
          disabledDates={disabledDates}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "datetimerange") {
      const shortcuts = "shortcuts" in fieldConfig ? fieldConfig.shortcuts : undefined;
      const disabledDates = "disabledDates" in fieldConfig ? fieldConfig.disabledDates : undefined;
      return (
        <AppDateTimeRangePicker
          placeholder={placeholder}
          value={field.value as import("@/components/DateTimeRangePicker").DateTimeRangeValue | undefined}
          onChange={field.onChange}
          shortcuts={shortcuts}
          disabledDates={disabledDates}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    return (
      <AppInput
        type={type}
        placeholder={placeholder}
        value={normalizeFieldValue(field.value, type)}
        onChange={field.onChange}
        className={`${inputClassName || ""} ${errorClassName}`}
      />
    );
  };

  /**
   * 渲染標籤 - 根據位置決定樣式
   */
  const renderLabel = (label: string | undefined, labelPosition: LabelPosition) => {
    if (!label) return null;

    if (labelPosition === "inline") {
      return (
        <FormLabel className="absolute start-2 top-0 z-10 -translate-y-1/2 px-1 text-xs font-medium bg-background text-foreground">
          {label}
        </FormLabel>
      );
    }

    if (labelPosition === "none") {
      return null;
    }

    return <FormLabel className={labelPosition === "left" ? "flex-[2] justify-end" : ""}>
      {label}
    </FormLabel>;
  };

  /**
   * 渲染欄位佈局 - 處理不同的 label 位置
   */
  const renderLayout = (
    label: string | undefined,
    labelPosition: LabelPosition,
    content: React.ReactNode,
    itemClassName?: string
  ) => {
    const isInline = labelPosition === "inline";
    const isLeft = labelPosition === "left";

    if (isLeft) {
      return (
        <FormItem className={itemClassName}>
          <div className="flex items-center gap-3">
            {renderLabel(label, labelPosition)}
            <div className="flex-[7]">{content}</div>
          </div>
        </FormItem>
      );
    }

    return (
      <FormItem className={`${isInline ? "relative" : ""} ${itemClassName || ""}`}>
        {!isLeft && renderLabel(label, labelPosition)}
        {content}
      </FormItem>
    );
  };

  /**
   * 渲染欄位 - 組合所有部分
   */
  const renderField = (fieldConfig: FieldConfig<TValues>) => {
    const {
      className: itemClassName,
      controlClassName,
      helperText,
      label,
      labelPosition = "top",
      name,
    } = fieldConfig;

    return (
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;
          const errorClassName = hasError ? "border-destructive" : "";
          const messageClassName = labelPosition === "left" ? "ml-[calc(22%+0.75rem)]" : "";

          const inputElement = renderInput(fieldConfig, field, errorClassName);
          const content = (
            <FormControl className={controlClassName || ""}>
              {inputElement}
            </FormControl>
          );

          return (
            <>
              {renderLayout(label, labelPosition, content, itemClassName)}
              {fieldState.error ? (
                <FormMessage className={messageClassName} />
              ) : helperText ? (
                <FormDescription className={messageClassName}>{helperText}</FormDescription>
              ) : null}
            </>
          );
        }}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {config.fields.map(renderField)}
        {children}
      </form>
    </Form>
  );
}) as <TValues extends FieldValues>(
  props: AppFormProps<TValues> & { ref?: React.Ref<FormRef<TValues>> }
) => React.ReactElement;
