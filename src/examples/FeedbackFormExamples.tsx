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

type FeedbackFormValues = {
  name: string;
  email: string;
  message: string;
};

export default function FeedbackFormExamples() {
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

  const handleFeedbackSubmit = (data: FeedbackFormValues) => {
    console.log("舊版 Feedback Form - Submitted data:", data);
  };

  const handleFeedbackSubmitNew = (data: FeedbackFormValues) => {
    console.log("新版 Feedback Form - Submitted data:", data);
  };

  return (
    <>
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
    </>
  );
}
