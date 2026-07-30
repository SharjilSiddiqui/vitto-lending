import type { FieldError } from "react-hook-form";

type BaseProps = {
  label: string;
  error?: FieldError;
};

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;
type SelectProps = BaseProps & React.SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }> };
type TextAreaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const controlClasses =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100";

export function InputField({ label, error, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input className={controlClasses} {...props} />
      {error ? <p className="mt-2 text-sm text-danger">{error.message}</p> : null}
    </label>
  );
}

export function SelectField({ label, error, options, ...props }: SelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select className={controlClasses} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-sm text-danger">{error.message}</p> : null}
    </label>
  );
}

export function TextAreaField({ label, error, ...props }: TextAreaProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea className={`${controlClasses} min-h-28 resize-none`} {...props} />
      {error ? <p className="mt-2 text-sm text-danger">{error.message}</p> : null}
    </label>
  );
}
