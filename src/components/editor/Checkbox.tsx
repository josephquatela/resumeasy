import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`w-4 h-4 flex items-center justify-center rounded border shrink-0 transition-colors ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-zinc-600 bg-transparent'
      }`}
    >
      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
    </button>
  );
}
