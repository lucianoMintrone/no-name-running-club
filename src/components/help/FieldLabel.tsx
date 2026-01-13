import { InfoTooltip } from "./InfoTooltip";

interface FieldLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  helpText?: string;
  required?: boolean;
  className?: string;
}

export function FieldLabel({
  htmlFor,
  children,
  helpText,
  required,
  className = "",
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-nnrc-purple-dark mb-1 ${className}`}
    >
      <span className="inline-flex items-center">
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
        {helpText && <InfoTooltip content={helpText} />}
      </span>
    </label>
  );
}
