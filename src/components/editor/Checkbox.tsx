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
      className={`w-[18px] h-[18px] flex items-center justify-center rounded-[4px] border shrink-0 transition-colors duration-150 ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-zinc-600 bg-transparent hover:border-zinc-400'
      }`}
    >
      {checked && <Check size={11} className="text-white" strokeWidth={3} />}
    </button>
  );
}
