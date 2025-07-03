// PropertySelector.tsx
const COLORS = [
  "bg-red-300", "bg-blue-300", "bg-yellow-300", "bg-green-300",
  "bg-pink-300", "bg-purple-300", "bg-orange-300", "bg-lime-300",
  "bg-teal-300", "bg-cyan-300", "bg-amber-300", "bg-indigo-300",
  "bg-neutral-300", // wild/unarranged
]

export function PropertySelector({ onSelect }: { onSelect?: (index: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((color, i) => (
        <button
          key={i}
          onClick={() => onSelect?.(i)}
          className={`w-6 h-6 rounded-full border shadow ${color}`}
        />
      ))}
    </div>
  )
}
