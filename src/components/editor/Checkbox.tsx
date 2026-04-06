interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-8 h-4 rounded-full shrink-0 transition-all duration-200 focus:outline-none ${
        checked
          ? 'bg-white/10 border border-white/40'
          : 'bg-zinc-800 border border-zinc-600 hover:border-zinc-500'
      }`}
    >
      <span
        className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all duration-200 ${
          checked
            ? 'left-[17px] bg-white'
            : 'left-0.5 bg-zinc-500'
        }`}
      />
    </button>
  );
}
