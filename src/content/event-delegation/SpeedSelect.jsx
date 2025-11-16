export function SpeedSelect(props) {
  return (
    <select
      className="bg-transparent outline-none cursor-pointer border-none text-xs text-slate-900 dark:text-slate-100"
      {...props}
    >
      <option value={1200}>Slow</option>
      <option value={800}>Normal</option>
      <option value={300}>Fast</option>
    </select>
  );
}
